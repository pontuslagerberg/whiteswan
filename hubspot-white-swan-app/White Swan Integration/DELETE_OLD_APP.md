# How to Delete the Old App (23240309)

The error says the app still has 1 active install. Try these steps:

## Step 1: Check Main HubSpot Account (Not Developer Portal)

The old app might be installed in your **main HubSpot account**, not the developer account:

1. **Go to your main HubSpot account:**
   - https://app.hubspot.com (not the developer portal)
   - Log in with the account that has the developer account

2. **Check Connected Apps:**
   - Click Settings (gear icon) → **Integrations** → **Connected Apps**
   - Look for any installed apps (might be named "My Get Started app" or similar)
   - **Uninstall** any apps you find there

## Step 2: Check Developer Portal Directly

Try accessing the app directly via the URL from the error:

```
https://app-na2.hubspot.com/developer/244253400/application/23240309
```

Or try:
```
https://app.hubspot.com/developer/244253400/application/23240309
```

Once there, look for a **Delete** or **Uninstall** button.

## Step 3: Check Test Accounts

If you have test accounts:

1. Go to Developer Portal → **Test Accounts**
2. Check each test account
3. Settings → Integrations → Connected Apps
4. Uninstall any apps there

## Step 4: Wait and Retry

Sometimes HubSpot's system takes a few minutes to update. Try:
1. Wait 5-10 minutes
2. Then try deploying again

## Step 5: Contact HubSpot Support

If none of the above works, contact HubSpot Support with:
- Application ID: 23240309
- Account ID: 244253400
- Error message about active installs

They can manually remove it from their system.

