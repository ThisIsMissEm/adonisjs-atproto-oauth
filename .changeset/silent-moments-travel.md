---
'@thisismissem/adonisjs-atproto-oauth': patch
---

Omit, but warn, if jwks or jwks_uri are present in client metadata in development

The CIMD Service cannot support `jwks` or `jwks_uri` since it cannot identify the writer of the CIMD, therefore those properties cannot be trusted. This omits these properties from the request to CIMD Service and adds a warning if they're used in development.