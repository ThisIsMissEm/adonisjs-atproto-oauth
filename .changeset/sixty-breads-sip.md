---
'@thisismissem/adonisjs-atproto-oauth': major
---

Fix OAuth Stores configuration for Adonis.js v7

This change allows you to bring your own [`SimpleStore`](https://github.com/bluesky-social/atproto/blob/main/packages/internal/simple-store/src/simple-store.ts) implementation, if you don't want to use Lucid, whilst also correcting how we were using Lucid.

Previously we created an `OAuthStore` for both `session` and `state` automatically in the provider, this caused things like hot module reloading to not work effectively, and caused a bunch of hard to debug typescript issues. It also caused issues with Adonis.js v7's new schema generation tooling.

## Upgrading from v6

Replace the following lines in `config/atproto_oauth.ts`:

```ts
  // Models to store OAuth State and Sessions:
  stateStore: OAuthState,
  sessionStore: OAuthSession,
```

With the following:

```ts
  // Models to store OAuth State and Sessions:
  stores: {
    states: lucidStateStore(() => import('#models/oauth_state')),
    sessions: lucidSessionStore(() => import('#models/oauth_session')),
  },
```

Remove the imports for the models:

```diff
- import OAuthState from '#models/oauth_state'
- import OAuthSession from '#models/oauth_session'
```

Add the import from `@thisismissem/adonisjs-atproto-oauth` for both `lucidStateStore` and `lucidSessionStore`.
