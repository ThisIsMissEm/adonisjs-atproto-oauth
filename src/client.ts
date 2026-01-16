import { Router } from '@adonisjs/core/http'
import {
  JoseKey,
  Keyset,
  NodeOAuthClient,
  NodeSavedSessionStore,
  NodeSavedStateStore,
  oauthClientIdDiscoverableSchema,
  OAuthClientMetadata,
  OAuthClientMetadataInput,
} from '@atproto/oauth-client-node'
import { OAuthMetadata } from './types.js'
import { RuntimeException } from '@adonisjs/core/exceptions'
import { ContainerBindings } from '@adonisjs/core/types'
import { Logger } from '@adonisjs/core/logger'
import { Application } from '@adonisjs/core/app'

export class OAuthClient {
  #client?: NodeOAuthClient
  #metadata?: OAuthClientMetadataInput | OAuthClientMetadata
  #keyset?: Keyset<JoseKey>
  #publicUrl?: string

  constructor(
    protected app: Application<ContainerBindings>,
    protected router: Router,
    protected logger: Logger,
    protected stateStore: NodeSavedStateStore,
    protected sessionStore: NodeSavedSessionStore
  ) {}

  private makeUrl(path: string): string {
    return new URL(path, this.#publicUrl).toString()
  }

  private makeRoute(routeIdentifier: string): string {
    return new URL(this.router.makeUrl(routeIdentifier), this.#publicUrl).toString()
  }

  private async createKeyset(jwks: string[]): Promise<Keyset<JoseKey>> {
    const keys = await Promise.all(
      jwks.map((key) => {
        return JoseKey.fromImportable(key)
      })
    )

    return new Keyset(keys)
  }

  private createRedirectUris(metadata: OAuthMetadata): [string, ...string[]] {
    return metadata.redirect_uris.map((redirectUri) => {
      if (redirectUri.startsWith('https://')) {
        return redirectUri
      }

      if (redirectUri.startsWith('http://')) {
        return redirectUri
      }

      // Handle as path based route:
      if (redirectUri.startsWith('/')) {
        return this.makeUrl(redirectUri)
      }

      // Otherwise handle as a route identifier
      return this.makeRoute(redirectUri)
    }) as [string, ...string[]]
  }

  private defaultClientId() {
    return this.makeUrl('/oauth-client-metadata.json')
  }

  private buildMetadata({ client_id, ...inputMetadata }: OAuthMetadata): OAuthClientMetadataInput {
    const scopes = (inputMetadata.scope ?? '').split(' ')
    if (!scopes.includes('atproto')) {
      scopes.unshift('atproto')
    }

    return {
      ...inputMetadata,
      client_id: client_id ?? this.defaultClientId(),
      scope: scopes.join(' ').trim(),
      redirect_uris: this.createRedirectUris(inputMetadata),
      grant_types: ['authorization_code', 'refresh_token'],
      response_types: ['code'],
      application_type: 'web',
      token_endpoint_auth_method: this.#keyset ? 'private_key_jwt' : 'none',
      token_endpoint_auth_signing_alg: this.#keyset ? 'RS256' : undefined,
      jwks_uri: this.#keyset ? this.makeUrl('/jwks.json') : undefined,
      dpop_bound_access_tokens: true,
    }
  }

  private async registerClient({
    client_id,
    ...metadata
  }: OAuthClientMetadataInput): Promise<OAuthClientMetadataInput> {
    const response = await fetch('https://cimd-service.fly.dev/clients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metadata),
    })

    const json = (await response.json()) as Record<string, any>

    if (!response.ok) {
      this.logger.error(JSON.stringify(json, null, 2))

      throw new RuntimeException('Failed to register client_id with cimd-service')
    }

    this.logger.info(`Registered client: ${json.client_id}`)
    this.logger.info(
      `You can add the following to the .env file to avoid dynamic registration in the future:\n\tATPROTO_OAUTH_CLIENT_ID=${json.client_id}`
    )

    return {
      ...metadata,
      client_id: json.client_id,
      application_type: 'native',
    }
  }

  async configure(publicUrl: string, metadata: OAuthMetadata, jwks?: string[]): Promise<void> {
    if (jwks && jwks.length > 0) {
      this.#keyset = await this.createKeyset(jwks)
    }

    this.#publicUrl = publicUrl

    const compiledMetadata = this.buildMetadata(metadata)
    const clientId = compiledMetadata.client_id

    if (this.app.inProduction) {
      if (!clientId) {
        throw new RuntimeException('Missing client_id for AT Protocol OAuth')
      }

      if (!clientId.startsWith(publicUrl)) {
        this.#metadata = await NodeOAuthClient.fetchMetadata({
          clientId: oauthClientIdDiscoverableSchema.parse(clientId),
        })
      } else {
        this.#metadata = compiledMetadata
      }
    } else {
      if (clientId !== this.defaultClientId()) {
        this.#metadata = await NodeOAuthClient.fetchMetadata({
          clientId: oauthClientIdDiscoverableSchema.parse(clientId),
        })
      } else {
        this.#metadata = await this.registerClient(compiledMetadata)
      }
    }
  }

  get client(): NodeOAuthClient {
    if (!this.#metadata) {
      throw new RuntimeException('AT Protocol OAuth Client not configured')
    }

    if (this.#client) {
      return this.#client
    }

    this.#client = new NodeOAuthClient({
      // This object will be used to build the payload of the /client-metadata.json
      // endpoint metadata, exposing the client metadata to the OAuth server.
      clientMetadata: this.#metadata,

      // Used to authenticate the client to the token endpoint. Will be used to
      // build the jwks object to be exposed on the "jwks_uri" endpoint.
      keyset: this.#keyset,

      // Interface to store authorization state data (during authorization flows)
      stateStore: this.stateStore,

      // Interface to store authenticated session data
      sessionStore: this.sessionStore,

      // A lock to prevent concurrent access to the session store. Optional if only one instance is running.
      // requestLock,
    })

    return this.#client
  }
}
