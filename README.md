# Adonis.js AT Protocol OAuth Package

This package provides a small [Adonis.js](https://adonisjs.com) provider and scaffolding for building applications quicking with [AT Protocol](https://atproto.com) OAuth.

## Requirements

The following packages should already be installed and configured in your project:

- @adonisjs/lucid
- @adonisjs/auth using session guard: [Documentation](https://docs.adonisjs.com/guides/authentication/session-guard)
- @vinejs/vine

## Installation

```sh
node ace add @thisismissem/adonisjs-atproto-oauth
```

### Configuring

If you didn't use `node ace add` you can later run the configuration using:

```sh
node ace configure @thisismissem/adonisjs-atproto-oauth
```

### Next steps

1. Run the migrations
2. Switch the Session Guard Provider to `atprotoAuthProvider`
3. Build your login form, using the `oauth.login` route (see `node ace list:routes` for all the routes)
4. ???
5. Profit!!

---

## Features

### Session Guard Provider

Normally with `@adonisjs/auth` the `provider` for the `sessionGuard` is `sessionUserProvider` which is backed by the database. For AT Protocol applications, your application doesn't manage the user account, instead it is provided by the PDS via OAuth, so we don't have a database model for a "user".

So instead of using `sessionUserProvider` we need to swap to `atprotoAuthProvider`, which provides users based on their OAuth session, automatically refreshing access tokens as necessary. This provides a `auth.user` value which has a full-features AT Protocol client that can interact with the authenticated users' PDS.

To use `atprotoAuthProvider`, we need to update the `@adonisjs/auth` configuration in `config/auth.ts` as follows:

```diff
import { defineConfig } from '@adonisjs/auth'
- import { sessionGuard, sessionUserProvider } from '@adonisjs/auth/session'
+ import { sessionGuard } from '@adonisjs/auth/session'
+ import { atprotoAuthProvider } from '@thisismissem/adonisjs-atproto-oauth/auth/provider'

const authConfig = defineConfig({
  default: 'web',
  guards: {
    web: sessionGuard({
      useRememberMeTokens: false,
+      provider: atprotoAuthProvider,
-      provider: sessionUserProvider({
-        model: () => import('#models/user'),
-      }),
    })
  },
})

export default authConfig
```

### Authenticated User

The authenticated user, which can be retrieved from the `HttpContext` in Adonis.js via `auth` provide access to `did` and AT Protocol `client` for the authenticated user.

- `auth.user.did` is the DID of the authenticated user
- `auth.user.client` is the `@atproto/lex` client for the authenticated user session

This allows you to write controller code like the following:

```typescript
import type { HttpContext } from '@adonisjs/core/http'
import lexicon from '#lexicons/index'

export default class ExampleController {
  async index({ auth, view }: HttpContext) {
    if (auth.isAuthenticated) {
      const profile = await auth.user.client(lexicon.app.bsky.actor.profile).catch((_) => undefined)
      if (profile?.value) {
        return view.render('example', { profile: JSON.stringify(profile.value, null, 2) })
      } else {
        return view.render('example', { profile: 'User not on Bluesky' })
      }
    }

    return view.render('example', { profile: 'null' })
  }
}
```

In the above `#lexicons` is an additional `imports` path in the `package.json` mapped to `"./app/lexicons/*.js"`. The files in that directory are code generated with the `lex build --clear --lexicons ../lexicons --out ./app/lexicons` command from the [`@atproto/lex`](https://github.com/bluesky-social/atproto/tree/main/packages/lex/lex#readme) package.

## OAuth Context

In the generated `app/controllers/oauth_controller.ts` file you'll notice that we have a `oauth` property on `HttpContext`. This is a lightweight wrapper around the `NodeOAuthClient` from `@atproto/oauth-client-node` which has methods integrated with Adonis.js

You can see the full methods provide in [`OAuthContext`](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/blob/main/src/oauth_context.ts)