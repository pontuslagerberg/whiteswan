# HubSpot — White Swan CRM app

This project is deployed with the **HubSpot CLI** to HubSpot’s hosting, not via the GitHub Actions workflows in this repo (those only deploy **root-level** `*.js` / `*.css` to S3 for the Bubble CDN).

**Project directory:** `White Swan Integration/` (see `hsproject.json` and `README.md` inside that folder).

**Typical deploy (from `White Swan Integration/`):**

```bash
cd "White Swan Integration"
hs project upload
hs project deploy
```

Details, OAuth, and troubleshooting: `White Swan Integration/FRESH_DEPLOY.md`, `SETUP_OAUTH.md`, `DEPLOYMENT_SUCCESS.md`.

`hubspot.config.yml` is gitignored (local CLI auth); do not commit secrets.
