import type { OAuthProviderConfig } from './types.js'

export function defineConfig<T extends OAuthProviderConfig>(config: T): OAuthProviderConfig {
  return config
}
