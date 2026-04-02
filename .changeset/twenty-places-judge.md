---
'@thisismissem/adonisjs-atproto-oauth': patch
---

Add handleUsername validator, for validating just the username segment of a handle string

This is useful when you're building a service that is for a specific handle domain, and you want to allow sign-in with just the username e.g., `emelia` instead of `emelia.eurosky.social`
