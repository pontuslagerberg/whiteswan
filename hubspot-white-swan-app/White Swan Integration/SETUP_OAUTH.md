# HubSpot OAuth Setup - Complete Guide

## ✅ What I've Updated

I've updated your `app-hsmeta.json` file with:

1. ✅ **All Required Scopes:**
   - Contacts (read + write)
   - Companies (read + write)
   - Deals (read + write)
   - Leads (read + write)
   - Notes (read + write)

2. ✅ **Redirect URL:**
   - `https://app.whiteswan.io/api/1.1/oauth_redirect`

3. ✅ **App Name & Description:**
   - Already configured as "White Swan"

## 📤 Step 1: Upload Your Updated Config

Upload the changes to HubSpot:

```bash
cd "hubspot-white-swan-app/White Swan Integration"
hs project upload
```

This will sync your `app-hsmeta.json` changes to HubSpot.

## 🖼️ Step 2: Add Logo (Optional but Recommended)

### Option A: Add Logo File in App Directory

1. Create a logo file (PNG or SVG recommended):
   - **App Logo**: 512x512 pixels (square)
   - **App Icon**: 64x64 pixels (smaller version)

2. Place it in:
   ```
   src/app/logo.png
   src/app/icon.png  (optional, smaller version)
   ```

3. Reference it in `app-hsmeta.json` (I'll update this after you add the file):
   ```json
   {
     "config": {
       "logo": "logo.png",
       "icon": "icon.png"
     }
   }
   ```

### Option B: Use External URL

If your logo is hosted online, you can reference it via URL. But HubSpot typically expects local files.

### Creating Logo Files

If you don't have a logo yet:
- Create a 512x512 PNG file
- Name it `logo.png`
- Place it in: `src/app/logo.png`
- Then I can update the config to reference it

## 🔑 Step 3: Get Your OAuth Credentials

After uploading, try these methods:

### Method 1: Check Developer Portal (After Upload)
1. Go to: https://app.hubspot.com/developer
2. Click **"Projects"** → **"White Swan Integration"**
3. Look for an **"Auth"** or **"Settings"** tab
4. Credentials might appear after the upload

### Method 2: Use CLI to Inspect

```bash
# Try to get project info
hs project dev --help

# Or check if there's a config file with credentials
cat hubspot.config.yml 2>/dev/null
ls -la .hubspot* 2>/dev/null
```

### Method 3: Check After First OAuth Attempt

Sometimes credentials are only revealed when you try to use OAuth. The credentials might be:
- Auto-generated during first upload
- Visible only when creating the OAuth flow
- Stored in HubSpot's system but not visible until needed

## 📋 Step 4: Use Your OAuth Setup

Once you have credentials, build your OAuth URL:

```
https://app.hubspot.com/oauth/authorize?
  client_id=YOUR_CLIENT_ID
  &redirect_uri=https://app.whiteswan.io/api/1.1/oauth_redirect
  &scope=oauth%20crm.objects.contacts.read%20crm.objects.contacts.write%20crm.objects.companies.read%20crm.objects.companies.write%20crm.objects.deals.read%20crm.objects.deals.write%20crm.objects.leads.read%20crm.objects.leads.write%20crm.objects.notes.read%20crm.objects.notes.write
```

## 🔄 Next Steps

1. **Upload the config:**
   ```bash
   hs project upload
   ```

2. **Add logo** (if you have one):
   - Place `logo.png` in `src/app/`
   - Let me know and I'll update the config

3. **Get credentials:**
   - Check developer portal after upload
   - Or they might appear during first OAuth attempt

4. **Test OAuth flow:**
   - Once you have Client ID, use it in your Bubble app
   - The redirect URL is already configured: `https://app.whiteswan.io/api/1.1/oauth_redirect`

## ❓ If You Still Can't Find Credentials

If credentials don't appear:
1. The redirect URL might need to be set via a different method
2. Credentials might be auto-generated on first OAuth request
3. You might need to contact HubSpot support

But let's try uploading first - that should sync everything!

