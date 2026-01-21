import { Client } from '@atproto/lex'
import { OAuthSession } from '@atproto/oauth-client-node'
import Macroable from '@poppinss/macroable'

export class AtProtoUser extends Macroable {
  #client?: Client
  constructor(protected session: OAuthSession) {
    super()
  }

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
