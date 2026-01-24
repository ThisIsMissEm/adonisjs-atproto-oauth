import { LucidModel } from '@adonisjs/lucid/types/model'
import { OAuthClientMetadataInput } from '@atproto/oauth-client-node'

export type OAuthProviderConfig = {
  publicUrl: string
  jwks?: string[]
  metadata: OAuthMetadata
  sessionStore: OAuthSessionsModel
  stateStore: OAuthStatesModel
}

export type OAuthMetadata = Omit<OAuthClientMetadataInput, ProtectedMetadata>

export type ProtectedMetadata =
  | 'grant_types'
  | 'response_types'
  | 'application_type'
  | 'token_endpoint_auth_method'
  | 'token_endpoint_auth_signing_alg'
  | 'jwks_uri'
  | 'dpop_bound_access_tokens'

export type OAuthSessionsModel = LucidModel & {
  new (): {
    sub: string
    value: string
  }
}

export type OAuthStatesModel = LucidModel & {
  new (): {
    key: string
    value: string
  }
}

export type OAuthModel = OAuthSessionsModel | OAuthStatesModel

export type * from './vine/types.js'
