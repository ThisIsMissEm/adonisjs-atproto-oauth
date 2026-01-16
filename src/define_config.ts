import { InvalidArgumentsException } from '@adonisjs/core/exceptions'
import type { OAuthProviderConfig } from './types.js'

export function defineConfig<T extends OAuthProviderConfig>(config: T): OAuthProviderConfig {
  if (!config.metadata.redirect_uris || config.metadata.redirect_uris.length < 1) {
    throw new InvalidArgumentsException(
      'Missing redirect_uris in AT Protocol OAuth client metadata. At least one must be defined.'
    )
  }

  return config
}
