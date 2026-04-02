# Fixing Deployment Issues

## Issues Found

1. **Invalid Scope**: `crm.objects.notes.read` is not recognized
2. **Old App Installation**: Need to delete old app (ID: 23240309) with active installs

## Solution Steps

### Step 1: Fix Notes Scope (Temporary - Removed)

I've temporarily removed the notes scopes from your config since `crm.objects.notes.read/write` might not be valid scope names. Notes might use different scopes like:
- `timeline.notes.read` / `timeline.notes.write`
- Or notes might be part of engagements scopes
- Or they might not be available as separate scopes

**For now, I've removed notes scopes so you can deploy. We can add them back once we find the correct scope names.**

### Step 2: Delete Old App Installation

The error says:
```
Application '23240309' cannot be deleted because it has 1 active installs. 
Please delete the app from the developer UI
```

**To remove the old app:**

1. **Go to the URL from the error:**
   ```
   https://app-na2.hubspot.com/developer/244253400/application/23240309
   ```
   Or try: `https://app.hubspot.com/developer/244253400/application/23240309`

2. **Alternative locations to find it:**
   - Go to: https://app.hubspot.com/developer
   - Look for **"Applications"** or **"Apps"** section (might be under legacy apps)
   - Look for the old app name (probably "My Get Started app" or similar)
   - Check both:
     - Main Developer Portal
     - Legacy Apps section (if it exists)

3. **If you can't find it in the UI:**
   - Try going to your main HubSpot account (not developer portal)
   - Settings → Integrations → Connected Apps
   - Find any apps installed there and uninstall them
   - Then try deploying again

4. **Or use the direct link:**
   - The error gave you a specific URL: `https://app-na2.hubspot.com/developer/244253400/application/23240309`
   - Try accessing that directly (might need to be logged in)

### Step 3: After Fixing

Once you've:
1. ✅ Removed notes scopes (I did this for you)
2. ✅ Deleted the old app installation

Try deploying again:

```bash
cd "hubspot-white-swan-app/White Swan Integration"
hs project upload
hs project deploy
```

## Finding Correct Notes Scope

To add notes back later, we need to find the correct scope names. Try:
- `timeline.notes.read` / `timeline.notes.write`
- `engagements.notes.read` / `engagements.notes.write`
- Or check HubSpot's scope documentation

## Notes on Auth Type Change

The warning about changing from "static" to "OAuth" is expected - your old app was static auth, new one is OAuth. That's fine, just need to clean up the old installation first.

