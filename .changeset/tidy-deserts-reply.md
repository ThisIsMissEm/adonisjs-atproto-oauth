---
'@thisismissem/adonisjs-atproto-oauth': patch
---

Support blank keys in jwks keyset

Previously, the `config/atproto_oauth.ts` file needed to have `jwks` commented out if you weren't using it in development (CIMD Service doesn't support jwks). This made using the same configuration for development and production more difficult.

Now you can leave that line commented in, and `undefined` values will be filtered out.

```ts
  jwks: [env.get('ATPROTO_OAUTH_JWT_PRIVATE_KEY')],
```
