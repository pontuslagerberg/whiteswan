# Logo Setup for HubSpot App

## Option 1: Host Logo via URL (Recommended)

Since HubSpot might need the logo to be accessible via URL, you have two options:

### Option A: Host on S3

1. Upload your logo PNG to your S3 bucket
2. Make it publicly accessible (or use a signed URL if needed)
3. Get the URL (e.g., `https://your-bucket.s3.amazonaws.com/logo.png`)

### Option B: Host via Bubble.io

1. Upload the logo to Bubble's file manager
2. Get the public URL from Bubble
3. Use that URL in the config

## Option 2: Local File (If Supported)

1. Place your logo in: `src/app/logo.png`
2. The CLI might automatically pick it up during upload
3. Or we can reference it in the config

## Adding Logo to Config

Once you have the logo URL, I can add it to `app-hsmeta.json`. HubSpot might support:
- `logo` field (URL or file path)
- `icon` field (smaller version)

Let me know which option you prefer and provide the URL if hosting externally!

