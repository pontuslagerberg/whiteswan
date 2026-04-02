# Fresh Deploy - Complete Steps

## Step 1: Upload Project

```bash
cd "hubspot-white-swan-app/White Swan Integration"
hs project upload
```

This will:
- Sync all your config files to HubSpot
- Create a new build
- Ensure redirect URIs are saved

## Step 2: Deploy

```bash
hs project deploy
```

Select the latest build when prompted.

## Step 3: Verify in Developer Portal

After deployment:

1. **Open Developer Portal:**
   ```bash
   hs project open
   ```

2. **Check Auth Tab:**
   - Verify redirect URIs are listed: 
     - `https://app.whiteswan.io/api/1.1/oauth_redirect`
     - `https://app.whiteswan.io/version-test/api/1.1/oauth_redirect`
   - If they're NOT there, add them manually

3. **Copy Sample Install URL:**
   - HubSpot should show a "Sample install URL" or "OAuth URL"
   - Copy that exact URL
   - Use that instead of building your own

## Step 4: Test OAuth

Use HubSpot's generated URL (from Auth tab), or try:

**With URL-encoded redirect_uri:**
```
https://app.hubspot.com/oauth/authorize?client_id=9ac5384b-5baa-48b2-9934-cbcc1fe33b54&redirect_uri=https%3A%2F%2Fapp.whiteswan.io%2Fapi%2F1.1%2Foauth_redirect&scope=oauth
```

## If Still Failing

Check browser console (F12) for specific error codes:
- `redirect_uri_mismatch`
- `invalid_client`
- `invalid_scope`
- Other specific errors

