import { SimpleStore, Value } from '@atproto-labs/simple-store'
import { safeParseJson } from './utils.js'
import { OAuthModel } from './types.js'

export class OAuthStore<Model extends OAuthModel, T extends Value> implements SimpleStore<
  string,
  T
> {
  constructor(protected model: Model) {}

  async set(key: string, internalState: T): Promise<void> {
    await this.model.updateOrCreate(
      { [this.model.primaryKey]: key },
      { value: JSON.stringify(internalState) }
    )
  }

  async get(key: string): Promise<T | undefined> {
    const record = await this.model.find(key)
    if (record === null) {
      return undefined
    }
    return safeParseJson(record.value) as T
  }

  async del(key: string): Promise<void> {
    await this.model
      .query()
      .where({ [this.model.primaryKey]: key })
      .delete()
  }
}
