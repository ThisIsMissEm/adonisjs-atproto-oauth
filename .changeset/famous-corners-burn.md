---
'@thisismissem/adonisjs-atproto-oauth': major
---

Automatically modify `config/auth.ts` on configure

This removes the step of manually replacing the `sessionUserProvider` with `atprotoUserProvider` in `config/auth.ts` after configuring the package.

The import path has changed from `@thisismissem/adonisjs-atproto-oauth/auth/provider` to `@thisismissem/adonisjs-atproto-oauth/auth/user_provider`.

This also renames:

- `atprotoAuthProvider` to `atprotoUserProvider`
- `AtProtoUser` to `AtprotoUser`

In the next major version the previous names for the above will be removed.
