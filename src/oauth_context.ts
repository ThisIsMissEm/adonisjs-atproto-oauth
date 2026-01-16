import { HttpContext } from '@adonisjs/core/http'
import { OAuthClient } from './client.js'
import { AtProtoUser } from './atproto_user.js'
import { AuthorizeOptions } from '@atproto/oauth-client-node'

export class OAuthContext {
  constructor(
    protected ctx: HttpContext,
    protected oauth: OAuthClient
  ) {}

  async authorize(input: string, options: AuthorizeOptions = {}): Promise<string> {
    const authorizationUrl = await this.oauth.client.authorize(input, {
      ...options,
      scope: options.scope ?? this.oauth.client.clientMetadata.scope,
    })

    return authorizationUrl.toString()
  }

  async canRegister(service?: string) {
    if (!service || !URL.canParse(service)) return false

    const authorizationServer = await this.oauth.client.oauthResolver
      .resolveFromService(service)
      .catch((err) => {
        this.ctx.logger.error(err, 'Failed to resolve Authorization Server: %s', service)
        return null
      })

    return (
      authorizationServer &&
      authorizationServer.metadata.prompt_values_supported?.includes('create')
    )
  }

  async register(service: string, options: AuthorizeOptions = {}) {
    const prompt = (await this.canRegister(service)) ? 'create' : 'select_account'

    return this.authorize(service, {
      ...options,
      prompt,
    })
  }

  async logout(did?: string) {
    if (did) {
      await this.oauth.client.revoke(did)
    }
  }

  async handleCallback(): Promise<{
    user: AtProtoUser
    state: string | null
  }> {
    const params = this.ctx.request.qs()
    const result = await this.oauth.client.callback(new URLSearchParams(params))

    return {
      user: new AtProtoUser(result.session),
      state: result.state,
    }
  }

  get clientMetadata() {
    return this.oauth.client.clientMetadata
  }
}
