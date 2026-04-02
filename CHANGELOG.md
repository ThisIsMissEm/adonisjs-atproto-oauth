# @thisismissem/adonisjs-atproto-oauth

## 3.0.3

### Patch Changes

- [#39](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/pull/39) [`d91648a`](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/commit/d91648a14a9d87b8ace997787f7f10c57a2b66e7) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Revert "Use schema generation now that Lucid supports non-ID primary keys"

- [#38](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/pull/38) [`dcb173f`](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/commit/dcb173fb775ac838cdb8b3c95e30eefe60012a3c) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Fix module resolution for typescript

- [#40](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/pull/40) [`71ea85a`](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/commit/71ea85a0ee87c19de1612425992b9c56957d6351) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Upgrade @atproto/lex to 0.0.23

- [#33](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/pull/33) [`e3ac465`](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/commit/e3ac4651e64c50f6efb5d0a9f3e7cc9065f441fb) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Add method to get the current access token's info

  This adds the `getTokenInfo` method to the `auth.user` (`AtprotoUser`)

- [#40](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/pull/40) [`b72d7db`](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/commit/b72d7db5c6bde5bff20695c4d2fd2bdec857a62d) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Add handleUsername validator, for validating just the username segment of a handle string

  This is useful when you're building a service that is for a specific handle domain, and you want to allow sign-in with just the username e.g., `emelia` instead of `emelia.eurosky.social`

## 3.0.2

### Patch Changes

- [#36](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/pull/36) [`48613d6`](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/commit/48613d6d4971555e2707688c5edec25699699836) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Use schema generation for models now that it supports primary keys that aren't id

## 3.0.1

### Patch Changes

- [#34](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/pull/34) [`f409451`](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/commit/f4094510fdfe1779bab33628e2e86866df503b34) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Add resolveIdentity to OAuthContext to allow validating PDS from OAuth Controller

## 3.0.0

### Major Changes

- [#31](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/pull/31) [`7f80188`](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/commit/7f80188f094b586719d837f7fc59b6e85ee409ca) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Automatically modify `config/auth.ts` on configure

  This removes the step of manually replacing the `sessionUserProvider` with `atprotoUserProvider` in `config/auth.ts` after configuring the package.

  The import path has changed from `@thisismissem/adonisjs-atproto-oauth/auth/provider` to `@thisismissem/adonisjs-atproto-oauth/auth/user_provider`.

  This also renames:
  - `atprotoAuthProvider` to `atprotoUserProvider`
  - `AtProtoUser` to `AtprotoUser`

  In the next major version the previous names for the above will be removed.

- [#31](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/pull/31) [`cdc63ff`](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/commit/cdc63ff348ab969ae1bd7791748a088bdaa9c77f) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Fix OAuth Stores configuration for Adonis.js v7

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

### Minor Changes

- [#31](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/pull/31) [`8dd6a04`](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/commit/8dd6a042844714482dd982de4601774f8671f7a2) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Automatically configure generated controller for Inertia.js or standard hypertext requests

  This adds better native support for Inertia.js to this package, as it has a specific way to do cross-site redirects.

### Patch Changes

- [#31](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/pull/31) [`2f9725b`](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/commit/2f9725b9d3e6728cea1f46d92ff7e3719a5579d2) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Fix installation issue due to stubs missing

  This was a bug introduced in 2.0.0, where the new bundler we started using rewrote code in an unexpected way, breaking the loading path for the `stubsRoot` when running configure.

- [#31](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/pull/31) [`d69b034`](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/commit/d69b0346553e92f589125968ec8eca8e0d756444) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Fix generated migrations having the `value` column as nullable

  This was causing typescript issues in Adonis.js v7

- [#31](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/pull/31) [`37721d0`](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/commit/37721d0262b8b66993b51ec1475314746d110ed4) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Improve Redirect URI Configuration

  Previously we needed the `config/atproto_oauth.ts` to contain at least one `redirect_uris` value in the metadata, even though this is unlikely to be changed from the default value (`/oauth/callback`).

  Now we make `redirect_uris` optional in the metadata, and default it to `/oauth/callback`, giving one less thing to configure.

- [#31](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/pull/31) [`8cf3f6d`](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/commit/8cf3f6d5aac4342408490885a836312750583a66) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Default to installing the additional packages on configure

- [#31](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/pull/31) [`dfdaaf8`](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/commit/dfdaaf85a36ce3fc38c5eab96f12a7ac293e0066) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Support blank keys in jwks keyset

  Previously, the `config/atproto_oauth.ts` file needed to have `jwks` commented out if you weren't using it in development (CIMD Service doesn't support jwks). This made using the same configuration for development and production more difficult.

  Now you can leave that line commented in, and `undefined` values will be filtered out.

  ```ts
    jwks: [env.get('ATPROTO_OAUTH_JWT_PRIVATE_KEY')],
  ```

- [#31](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/pull/31) [`18bece8`](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/commit/18bece858f77f18f077883b4f0ab152e4cc59121) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Add additional default properties to metadata

  This adds the following properties to the `metadata` in `config/atproto_oauth.ts` by default:
  - `client_uri`
  - `scope` (defaults to `atproto`)

  This also adds a few commented out, but recommended for production properties to the metadata:
  - `logo_uri`
  - `tos_uri`
  - `policy_uri`

## 2.0.0

### Major Changes

- [#23](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/pull/23) [`01ec856`](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/commit/01ec8569765515498fadce3e6187642582e758a7) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Upgrade to Adonis.js v7

### Patch Changes

- [#29](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/pull/29) [`4f0279d`](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/commit/4f0279d644eb5562e3ab6340db0eec2cb699c19b) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Allow using Secret values for the JWKS keys

  This prevents the JWKS keys from accidentally being logged, as the value is secret and redacted automatically in logs if someone does `console.log(env)` or similar where `env` is `import "#start/env"`.

## 1.0.2

### Patch Changes

- [#21](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/pull/21) [`c9b46cb`](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/commit/c9b46cb02f61ab2fc86039bf5b449eef51530d4f) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Fix outdated `@atproto/lex` version

## 1.0.1

### Patch Changes

- [#19](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/pull/19) [`9d58418`](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/commit/9d584182f237a30d7c9399977993a96a0b51f8ca) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Fix broken `isAtUriString` from `@atproto/lex-schema` v0.0.9

  In v0.0.9 of `@atproto/lex-schema`, the method `isAtUriString` returned false for valid AT URI strings. Upgrading to v0.0.10 fixes this issue.

## 1.0.0

### Major Changes

- [#17](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/pull/17) [`e572c15`](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/commit/e572c15660bbb54ef379d97c1cef51b7d2e68a11) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - First stable release of @thisismissem/adonisjs-atproto-oauth

## 0.2.0

### Minor Changes

- [#13](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/pull/13) [`1dbf81e`](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/commit/1dbf81e5c6b049881b3daf06ac200968c171a004) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Add extensibility for the `user` instance returned from `oauth.handleCallback`

  We've added the ability to extend the `user` returned from `oauth.handleCallback` which is a `AtProtoUser` instance, and this extensibility is provided by the same means as [Adonis.js Framework](https://docs.adonisjs.com/guides/concepts/extending-adonisjs) uses.

  For example, if we wanted to add a method for fetching the users' profile from Bluesky, we would have the `src/extensions.ts` file from the Adonis.js documentation contain the following contents:

  ```ts
  // src/extensions.ts
  import { AtProtoUser } from '@thisismissem/adonisjs-atproto-oauth'
  import * as lexicon from '#lexicons/index'

  AtProtoUser.macro('fetchProfile', async function hasProfile(this: AtProtoUser) {
    const profile = await this.client.get(lexicon.app.bsky.actor.profile).catch((_) => undefined)

    if (profile?.value) {
      return profile.value
    }

    return undefined
  })

  declare module '@thisismissem/adonisjs-atproto-oauth' {
    interface AtProtoUser {
      fetchProfile(): Promise<undefined | lexicon.app.bsky.actor.profile.Main>
    }
  }
  ```

  Then when we're handling a request, we can do:

  ```ts
  export default class ExampleController {
    async show({ auth, response }: HttpContext) {
      const user = auth.getUserOrFail()
      const profile = await user.fetchProfile()

      response.json(profile)
    }
  }
  ```

- [#13](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/pull/13) [`1dbf81e`](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/commit/1dbf81e5c6b049881b3daf06ac200968c171a004) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Add vine.js rules for validating various AT Protocol string formats

  Implementation of custom vine.js rules for validating various AT Protocol [string format](https://atproto.com/specs/lexicon#string-formats):
  - `vine.atproto.identifier()`
  - `vine.atproto.did()`
  - `vine.atproto.handle()`
  - `vine.atproto.service()`
  - `vine.atproto.atUri()`
  - `vine.atproto.datetime()`
  - `vine.atproto.language()`

  The only rule that isn't a typical [string format](https://atproto.com/specs/lexicon#string-formats) from AT Protocol is `vine.atproto.service()` which is used for validating OAuth service identifiers, which are essentially just URLs without an components after the hostname. You'd use this rule for validating an OAuth sign up request.

### Patch Changes

- [#13](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/pull/13) [`1dbf81e`](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/commit/1dbf81e5c6b049881b3daf06ac200968c171a004) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Add trace logging to OAuth Client CIMD requests

- [#13](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/pull/13) [`1dbf81e`](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/commit/1dbf81e5c6b049881b3daf06ac200968c171a004) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Fix registration to not send prompt=select_account as fallback

  In [pull request #4569](https://github.com/bluesky-social/atproto/pull/4569) on the bluesky-social/atproto repository, the handling of `prompt=select_account` was changed to follow the OpenID Connect 1.0 Core specification, where by if no accounts are currently authenticated, then it will redirect back with an error.

  We were using `prompt=select_account` as a fallback for `prompt=create` support not being advertised. This was displaying the "create account / login / back" screen, and we can actually get the same UI by just not sending `prompt` at all.

- [#13](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/pull/13) [`1dbf81e`](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/commit/1dbf81e5c6b049881b3daf06ac200968c171a004) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Omit, but warn, if jwks or jwks_uri are present in client metadata in development

  The CIMD Service cannot support `jwks` or `jwks_uri` since it cannot identify the writer of the CIMD, therefore those properties cannot be trusted. This omits these properties from the request to CIMD Service and adds a warning if they're used in development.

## 0.1.0

### Minor Changes

- [#1](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/pull/1) [`2ba9d19`](https://github.com/ThisIsMissEm/adonisjs-atproto-oauth/commit/2ba9d193c0b7dc0de3b3af1eb09a70216f7f6d60) Thanks [@ThisIsMissEm](https://github.com/ThisIsMissEm)! - Initial working version of AT Protocol OAuth for Adonis.js
