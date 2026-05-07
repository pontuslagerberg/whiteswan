/**
 * White Swan API Proxy (Lambda)
 *
 * Transparent proxy that forwards requests to a target URL, injecting
 * BackNine API keys from Secrets Manager. The request and response bodies
 * are passed through untouched.
 *
 * Authentication (required):
 *   Authorization: Bearer <proxyAccessToken>
 *
 * Required headers on incoming request:
 *   x-target-url  – the upstream URL to forward to
 *   x-key-type    – "SaaS" or "DigitalAgent" (selects which API key to inject)
 *
 * The selected key is sent upstream as:
 *   X-BACKNINE-AUTHENTICATION: <key>
 */

const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require('@aws-sdk/client-secrets-manager');

const SECRET_NAME = process.env.SECRET_NAME || 'white-swan-proxy/backnine-api-keys';

let cachedKeys = null;

async function getApiKeys() {
  if (cachedKeys) {
    console.log('[proxy] secrets: cache hit');
    return cachedKeys;
  }
  console.log('[proxy] secrets: fetching from Secrets Manager');
  const client = new SecretsManagerClient({
    region: process.env.AWS_REGION || 'us-east-1',
  });
  const resp = await client.send(
    new GetSecretValueCommand({ SecretId: SECRET_NAME }),
  );
  cachedKeys = JSON.parse(resp.SecretString);
  return cachedKeys;
}

function getHeader(event, name) {
  const h = event.headers || {};
  const lower = name.toLowerCase();
  for (const k of Object.keys(h)) {
    if (k.toLowerCase() === lower) return h[k];
  }
  return undefined;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-target-url, x-key-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
};

function errorResponse(statusCode, message) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    body: JSON.stringify({ error: message }),
  };
}

const TEXT_CONTENT_PATTERNS = [
  /^text\//,
  /\/json/,
  /\/xml/,
  /\/html/,
  /\/javascript/,
  /\/css/,
  /\/csv/,
  /\/yaml/,
  /\/x-www-form-urlencoded/,
];

function isTextContentType(contentType) {
  if (!contentType) return false;
  const ct = contentType.toLowerCase();
  return TEXT_CONTENT_PATTERNS.some((p) => p.test(ct));
}

exports.handler = async (event) => {
  if (event.requestContext?.http?.method === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }

  let secrets;
  try {
    secrets = await getApiKeys();
  } catch (err) {
    console.error('Secrets Manager error:', err);
    return errorResponse(500, 'Failed to retrieve secrets');
  }

  const authHeader = getHeader(event, 'authorization');
  if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
    return errorResponse(401, 'Missing or invalid Authorization header');
  }
  const providedToken = authHeader.slice(7);
  if (!secrets.proxyAccessToken || providedToken !== secrets.proxyAccessToken) {
    return errorResponse(401, 'Unauthorized');
  }

  const targetUrl = getHeader(event, 'x-target-url');
  const keyType = getHeader(event, 'x-key-type');

  if (!targetUrl) return errorResponse(400, 'Missing x-target-url header');
  if (!keyType) return errorResponse(400, 'Missing x-key-type header');

  const apiKey = secrets[keyType];
  if (!apiKey) {
    return errorResponse(
      400,
      `Unknown key_type: "${keyType}". Valid values: SaaS, DigitalAgent`,
    );
  }

  const method = event.requestContext?.http?.method || 'POST';

  let rawBody = event.body || null;
  if (rawBody && event.isBase64Encoded) {
    rawBody = Buffer.from(rawBody, 'base64');
  }

  const incomingContentType = getHeader(event, 'content-type') || 'application/json';

  console.log('[proxy] forwarding', {
    method,
    targetUrl,
    keyType,
    keyTail: apiKey ? apiKey.slice(-4) : null,
    isBase64Encoded: event.isBase64Encoded,
    bodyType: rawBody ? typeof rawBody : null,
    body: typeof rawBody === 'string' ? rawBody : '[buffer]',
  });

  try {
    const fetchOpts = {
      method,
      headers: {
        'Content-Type': incomingContentType,
        'X-BACKNINE-AUTHENTICATION': apiKey,
      },
    };

    if (rawBody && method !== 'GET' && method !== 'HEAD') {
      fetchOpts.body = rawBody;
    }

    const upstream = await fetch(targetUrl, fetchOpts);
    const responseContentType =
      upstream.headers.get('content-type') || 'application/json';

    if (isTextContentType(responseContentType)) {
      const responseBody = await upstream.text();
      console.log('[proxy] upstream response', { status: upstream.status, body: responseBody });
      return {
        statusCode: upstream.status,
        headers: { 'Content-Type': responseContentType, ...CORS_HEADERS },
        body: responseBody,
      };
    }

    const buffer = Buffer.from(await upstream.arrayBuffer());
    return {
      statusCode: upstream.status,
      headers: { 'Content-Type': responseContentType, ...CORS_HEADERS },
      body: buffer.toString('base64'),
      isBase64Encoded: true,
    };
  } catch (err) {
    console.error('Upstream request failed:', err);
    return errorResponse(502, `Upstream request failed: ${err.message}`);
  }
};
