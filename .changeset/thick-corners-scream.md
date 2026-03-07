---
'@thisismissem/adonisjs-atproto-oauth': patch
---

Allow using Secret values for the JWKS keys

This prevents the JWKS keys from accidentally being logged, as the value is secret and redacted automatically in logs if someone does `console.log(env)` or similar where `env` is `import "#start/env"`.
