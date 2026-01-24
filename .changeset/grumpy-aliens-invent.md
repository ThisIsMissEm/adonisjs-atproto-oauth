---
'@thisismissem/adonisjs-atproto-oauth': patch
---

Fix registration to not send prompt=select_account as fallback

In [pull request #4569](https://github.com/bluesky-social/atproto/pull/4569) on the bluesky-social/atproto repository, the handling of `prompt=select_account` was changed to follow the OpenID Connect 1.0 Core specification, where by if no accounts are currently authenticated, then it will redirect back with an error.

We were using `prompt=select_account` as a fallback for `prompt=create` support not being advertised. This was displaying the "create account / login / back" screen, and we can actually get the same UI by just not sending `prompt` at all.