# Refresh OAuth Setup - Step by Step

## Why This Might Fix It

A fresh upload and deploy will:
- ✅ Sync all config to HubSpot's database
- ✅ Ensure redirect URIs are properly registered
- ✅ Update app status to active/deployed
- ✅ Generate fresh OAuth credentials if needed

## Steps to Run

### 1. Upload Project
```bash
cd "hubspot-white-swan-app/White Swan Integration"
hs project upload
```

Wait for it to complete. You should see:
- ✓ Uploaded project files
- ✓ Built successfully

### 2. Deploy Project
```bash
hs project deploy
```

When prompted, select the latest build number.

### 3. Open Developer Portal
```bash
hs project open
```

This opens your app in the browser.

### 4. Verify Auth Configuration

In the Developer Portal:

1. **Go to Auth Tab**
2. **Check Redirect URLs:**
   - Should see:
     - `https://app.whiteswan.io/api/1.1/oauth_redirect`
     - `https://app.whiteswan.io/api/1.1/oauth_redirect` (version-test)
   - If NOT listed, **manually add them** in the UI

3. **Copy Sample Install URL:**
   - HubSpot should show a "Sample install URL" or "OAuth URL"
   - **Use that exact URL** - it's guaranteed to be correct

### 5. Test OAuth

**Option A: Use HubSpot's Generated URL**
- Copy the "Sample install URL" from Auth tab
- Use that exact URL

**Option B: Build Your Own (with encoding)**
```
https://app.hubspot.com/oauth/authorize?client_id=9ac5384b-5baa-48b2-9934-cbcc1fe33b54&redirect_uri=https%3A%2F%2Fapp.whiteswan.io%2Fapi%2F1.1%2Foauth_redirect&scope=oauth
```

## If Still Failing After Fresh Deploy

1. **Check Browser Console:**
   - Open Developer Tools (F12)
   - Console tab - look for errors
   - Network tab - check failed requests

2. **Verify Redirect URI Match:**
   - In HubSpot Auth tab, the redirect URI must be EXACTLY:
     - `https://app.whiteswan.io/api/1.1/oauth_redirect`
   - No trailing slash
   - Exact case
   - Must match what's in your OAuth URL

3. **Try Minimal Scope First:**
   - Just `scope=oauth` (no other scopes)
   - If that works, add scopes one by one

4. **Check App Status:**
   - Make sure app shows as "Deployed" or "Active"
   - Not "Draft" or "Error"

## After Fresh Deploy

The most important thing is to **verify the redirect URIs are actually listed in the Auth tab**. Even if they're in your config file, HubSpot might not have saved them properly. If they're not there, add them manually!

