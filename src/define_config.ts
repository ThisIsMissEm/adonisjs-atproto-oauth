import type { Config, TapProviderConfig } from './types.js'

export function defineConfig<T extends Config>({ url, ...config }: T): TapProviderConfig {
  const tapConfig: TapProviderConfig = {
    url,
    config,
  }

  // Sensible default:
  if (typeof tapConfig.url === 'undefined') {
    tapConfig.url = 'http://localhost:2480'
  }

  // FIXME: Workaround for https://github.com/bluesky-social/atproto/issues/4476
  if (tapConfig.url.endsWith('/')) {
    tapConfig.url = tapConfig.url.slice(0, -1)
  }

  return tapConfig
}
