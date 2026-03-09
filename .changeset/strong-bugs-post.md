---
'@thisismissem/adonisjs-atproto-oauth': patch
---

Improve Redirect URI Configuration

Previously we needed the `config/atproto_oauth.ts` to contain at least one `redirect_uris` value in the metadata, even though this is unlikely to be changed from the default value (`/oauth/callback`).

Now we make `redirect_uris` optional in the metadata, and default it to `/oauth/callback`, giving one less thing to configure.
