import { Client } from '@atproto/lex'
import { OAuthSession } from '@atproto/oauth-client-node'

export class AtProtoUser {
  #client?: Client
  constructor(protected session: OAuthSession) {}

  get did() {
    return this.session.did
  }

  get client() {
    if (this.#client) return this.#client
    this.#client = new Client(this.session)
    return this.#client
  }

  get [Symbol.toStringTag]() {
    return JSON.stringify({ did: this.did })
  }
}
