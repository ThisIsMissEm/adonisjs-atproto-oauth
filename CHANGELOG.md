# @thisismissem/adonisjs-atproto-oauth

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
