---
'@thisismissem/adonisjs-atproto-oauth': patch
---

Add extensibility for the `user` instance returned from `oauth.handleCallback`

We've added the ability to extend the `user` returned from `oauth.handleCallback` which is a `AtProtoUser` instance, and this extensibility is provided by the same means as [Adonis.js Framework](https://docs.adonisjs.com/guides/concepts/extending-adonisjs) uses.

For example, if we wanted to add a method for fetching the users' profile from Bluesky, we would have the `src/extensions.ts` file from the Adonis.js documentation contain the following contents:

```ts
// src/extensions.ts
import { AtProtoUser } from '@thisismissem/adonisjs-atproto-oauth'
import * as lexicon from '#lexicons/index'

AtProtoUser.macro('fetchProfile', async function hasProfile(this: AtProtoUser) {
  const profile = await this.client
    .get(lexicon.app.bsky.actor.profile)
    .catch((_) => undefined)

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