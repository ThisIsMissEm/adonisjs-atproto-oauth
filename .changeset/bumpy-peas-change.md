---
'@thisismissem/adonisjs-atproto-oauth': patch
---

Fix installation issue due to stubs missing

This was a bug introduced in 2.0.0, where the new bundler we started using rewrote code in an unexpected way, breaking the loading path for the `stubsRoot` when running configure.
