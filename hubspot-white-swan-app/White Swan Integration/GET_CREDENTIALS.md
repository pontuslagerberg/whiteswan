# Getting HubSpot OAuth Credentials via CLI

Since the UI doesn't show OAuth settings, here's how to get your credentials via CLI:

## Method 1: Check Project/App Info

```bash
cd "hubspot-white-swan-app/White Swan Integration"
hs project get
```

This might show your app details including credentials.

## Method 2: Upload and Check in Developer Portal

After uploading your updated config:

```bash
hs project upload
```

Then check: https://app.hubspot.com/developer
- Go to Projects → White Swan Integration
- The credentials might appear after upload

## Method 3: Direct CLI Commands

Try these commands to see what's available:

```bash
# List apps/projects
hs project list

# Get project details
hs project get

# Upload the project (after making changes)
hs project upload
```

## Method 4: Check Config Files

The credentials might be in a config file:

```bash
# Check for hubspot.config.yml or similar
ls -la
cat hubspot.config.yml 2>/dev/null || echo "No config.yml found"
```

## After Upload

Once you upload the project with the updated `app-hsmeta.json`, the credentials should be available either:
1. In the developer portal (after refreshing)
2. Via CLI commands
3. In local config files

