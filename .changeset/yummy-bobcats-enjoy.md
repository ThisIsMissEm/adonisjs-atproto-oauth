---
'@thisismissem/adonisjs-atproto-oauth': patch
---

Add additional default properties to metadata

This adds the following properties to the `metadata` in `config/atproto_oauth.ts` by default:

- `client_uri`
- `scope` (defaults to `atproto`)

This also adds a few commented out, but recommended for production properties to the metadata:

- `logo_uri`
- `tos_uri`
- `policy_uri`
