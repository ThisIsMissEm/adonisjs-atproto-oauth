---
'@thisismissem/adonisjs-atproto-oauth': patch
---

Fix broken `isAtUriString` from `@atproto/lex-schema` v0.0.9

In v0.0.9 of `@atproto/lex-schema`, the method `isAtUriString` returned false for valid AT URI strings. Upgrading to v0.0.10 fixes this issue.