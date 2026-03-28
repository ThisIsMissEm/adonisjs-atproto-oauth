import type { LucidModel } from '@adonisjs/lucid/types/model'
import type {
  AtprotoDid,
  NodeSavedSession,
  NodeSavedState,
  OAuthClientMetadataInput,
} from '@atproto/oauth-client-node'
import { type Secret } from '@poppinss/utils'
import type { OAuthStore } from './oauth_store.ts'
import type { SimpleStore } from '@atproto-labs/simple-store'
import type { HandleString } from '@atproto/lex'

export type OAuthStateModel = LucidModel & {
  new (): {
    key: string
    value: string
  }
}

export type OAuthSessionModel = LucidModel & {
  new (): {
    sub: string
    value: string
  }
}

export type OAuthModel = OAuthSessionModel | OAuthStateModel

export type StoreProvider = {
  states: OAuthStore<OAuthStateModel, NodeSavedState> | SimpleStore<string, NodeSavedState>
  sessions: OAuthStore<OAuthSessionModel, NodeSavedSession> | SimpleStore<string, NodeSavedSession>
}

export type JwksKeyset = (string | Secret<string>)[]
export type JwksConfig = (string | Secret<string> | undefined)[]

export type OAuthProviderConfig = {
  publicUrl: string
  jwks?: JwksConfig
  metadata: OAuthMetadata
  stores: StoreProvider
}

export type OAuthMetadata = Omit<OAuthClientMetadataInput, ProtectedMetadata | 'redirect_uris'> & {
  redirect_uris?: OAuthClientMetadataInput['redirect_uris']
}

export type OAuthResolvedIdentity = {
  pds: URL
  did: AtprotoDid
  handle: HandleString
  authorizationServer: URL
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

export type * from './vine/types.js'
