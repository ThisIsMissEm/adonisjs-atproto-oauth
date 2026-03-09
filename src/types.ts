import type { LucidModel } from '@adonisjs/lucid/types/model'
import type { OAuthClientMetadataInput } from '@atproto/oauth-client-node'
import { type Secret } from '@poppinss/utils'

export type JwksKeyset = (string | Secret<string>)[]
export type JwksConfig = (string | Secret<string> | undefined)[]

export type OAuthProviderConfig = {
  publicUrl: string
  jwks?: JwksConfig
  metadata: OAuthMetadata
  sessionStore: OAuthSessionsModel
  stateStore: OAuthStatesModel
}

export type OAuthMetadata = Omit<OAuthClientMetadataInput, ProtectedMetadata | 'redirect_uris'> & {
  redirect_uris?: OAuthClientMetadataInput['redirect_uris']
}

export type ProtectedMetadata =
  | 'grant_types'
  | 'response_types'
  | 'application_type'
  | 'token_endpoint_auth_method'
  | 'token_endpoint_auth_signing_alg'
  | 'jwks_uri'
  | 'jwks'
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
