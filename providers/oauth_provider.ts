import type { ApplicationService } from '@adonisjs/core/types'
import type { NodeSavedSession, NodeSavedState } from '@atproto/oauth-client-node'
import type { OAuthSessionsModel, OAuthStatesModel, OAuthProviderConfig } from '../src/types.js'
import type { VineAtproto } from '../src/vine/define.js'

import { RuntimeException } from '@adonisjs/core/exceptions'
import { OAuthClient } from '../src/client.js'
import { OAuthStore } from '../src/oauth_store.js'

declare module '@vinejs/vine' {
  interface Vine {
    atproto: VineAtproto
  }
}

declare module '@adonisjs/core/types' {
  export interface ContainerBindings {
    'atproto.oauth.config': OAuthProviderConfig
    'atproto.oauth.client': OAuthClient
  }
}

export default class AtProtoProvider {
  constructor(protected app: ApplicationService) {}

  async registerVinejs() {
    if (this.app.usingVineJS) {
      const { defineVineAtProto } = await import('../src/vine/define.js')
      defineVineAtProto()
    }
  }

  register() {
    this.app.container.singleton('atproto.oauth.config', async () => {
      const config = this.app.config.get<OAuthProviderConfig>('atproto_oauth', {})

      if (!config || !config.publicUrl) {
        throw new RuntimeException(
          'Invalid config exported from "config/atproto.ts" file. Make sure to return an object with the publicUrl property defined'
        )
      }

      if (!config.sessionStore || !config.stateStore) {
        throw new RuntimeException(
          'Invalid config exported from "config/atproto.ts" file. Missing sessionProvider or stateProvider'
        )
      }

      return config
    })

    this.app.container.singleton('atproto.oauth.client', async () => {
      const config = await this.app.container.make('atproto.oauth.config')
      const logger = await this.app.container.make('logger')

      return new OAuthClient(this.app, logger, stateStore, sessionStore)
    })
  }

  async boot() {
    const config = await this.app.container.make('atproto.oauth.config')
    const client = await this.app.container.make('atproto.oauth.client')
    const router = await this.app.container.make('router')

    router.get('/oauth-client-metadata.json', (ctx) => {
      return ctx.response.json(client.client.clientMetadata, true)
    })

    router.get('/jwks.json', (ctx) => {
      return ctx.response.json(client.client.jwks, true)
    })

    if (this.app.getEnvironment() === 'web') {
      await client.configure(config.publicUrl, config.metadata, config.jwks)
    }

    await this.registerVinejs()
  }

  async start() {}

  async shutdown() {}
}
