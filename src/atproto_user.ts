import type { OAuthSession } from '@atproto/oauth-client-node'
import { Client } from '@atproto/lex'
import Macroable from '@poppinss/macroable'

export class AtprotoUser extends Macroable {
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

/**
 * @deprecated
 */
export class AtProtoUser extends AtprotoUser {}
