---
'@thisismissem/adonisjs-atproto-oauth': minor
---

Add vine.js rules for validating various AT Protocol string formats

Implementation of custom vine.js rules for validating various AT Protocol [string format](https://atproto.com/specs/lexicon#string-formats):

- `vine.atproto.identifier()`
- `vine.atproto.did()`
- `vine.atproto.handle()`
- `vine.atproto.service()`
- `vine.atproto.atUri()`
- `vine.atproto.datetime()`
- `vine.atproto.language()`

The only rule that isn't a typical [string format](https://atproto.com/specs/lexicon#string-formats) from AT Protocol is `vine.atproto.service()` which is used for validating OAuth service identifiers, which are essentially just URLs without an components after the hostname. You'd use this rule for validating an OAuth sign up request.