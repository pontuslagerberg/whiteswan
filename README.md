# whiteswan
This repository contains publicly available code which supports technical integration with the White Swan brokerage platform.

## Features
- Automatic jsDelivr cache purging via GitHub Actions
- Efficient diff-based purging (only changed files since last release)
- Smart retry logic using API's throttlingReset value for accurate timing
- Handles throttling gracefully with up to 1-hour wait times
- Non-blocking failures (workflow continues even if some purges fail)
