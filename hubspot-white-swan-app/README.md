# HubSpot — White Swan CRM app

This project is deployed with the **HubSpot CLI** to HubSpot’s hosting.

**Why `node_modules` is not in git:** Dependencies are pinned in `package-lock.json` (and `package.json`). You (and CI) run `npm ci` in `White Swan Integration/src/app/cards/` to reproduce the same tree. Committing `node_modules` would bloat the repo, cause merge pain, and often breaks across OS/CPU. That is normal for Node projects—not a gap in the HubSpot integration.

**CI/CD:** `.github/workflows/hubspot-deploy.yml` runs on pushes to `main` that touch `hubspot-white-swan-app/**`. Add secrets `HUBSPOT_ACCOUNT_ID` and `HUBSPOT_PERSONAL_ACCESS_KEY` in the GitHub repo settings.

**Project directory:** `White Swan Integration/` (see `hsproject.json` and `README.md` inside that folder).

**Typical deploy (from `White Swan Integration/`):**

```bash
cd "White Swan Integration"
hs project upload
hs project deploy
```

Details, OAuth, and troubleshooting: `White Swan Integration/FRESH_DEPLOY.md`, `SETUP_OAUTH.md`, `DEPLOYMENT_SUCCESS.md`.

`hubspot.config.yml` is gitignored (local CLI auth); do not commit secrets.
