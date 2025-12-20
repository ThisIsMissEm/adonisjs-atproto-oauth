import { TapConfig, Tap as TapClient } from '@atproto/tap'

export type Config = {
  url: string
} & TapConfig

export type TapProviderConfig = {
  url: Config['url']
  config: TapConfig
}

export type Tap = Pick<TapClient, 'addRepos' | 'removeRepos' | 'getRepoInfo' | 'resolveDid'>
