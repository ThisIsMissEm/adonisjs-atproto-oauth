import { RuntimeException } from '@adonisjs/core/exceptions'
import type { ApplicationService } from '@adonisjs/core/types'
import { OAuthSessionsModel, OAuthStatesModel, type OAuthProviderConfig } from '../src/types.js'
import { OAuthClient } from '../src/client.js'
import { OAuthStore } from '../src/oauth_store.js'
import { NodeSavedSession, NodeSavedState } from '@atproto/oauth-client-node'

declare module '@adonisjs/core/types' {
  export interface ContainerBindings {
    'atproto.oauth.config': OAuthProviderConfig
    'atproto.oauth.client': OAuthClient
  }
}

export default class AtProtoProvider {
  constructor(protected app: ApplicationService) {}

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
      const router = await this.app.container.make('router')
      const sessionStore = new OAuthStore<OAuthSessionsModel, NodeSavedSession>(config.sessionStore)
      const stateStore = new OAuthStore<OAuthStatesModel, NodeSavedState>(config.stateStore)

      return new OAuthClient(this.app, router, logger, stateStore, sessionStore)
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
  }

  async start() {}

  async shutdown() {}
}
