import type { SimpleStore, Value } from '@atproto-labs/simple-store'
import type { NodeSavedSession, NodeSavedState } from '@atproto/oauth-client-node'
import type { OAuthModel, OAuthStateModel, OAuthSessionModel } from './types.js'
import { safeParseJson } from './utils.js'

export class OAuthStore<Model extends OAuthModel, T extends Value> implements SimpleStore<
  string,
  T
> {
  protected model?: Model

  constructor(
    protected options: {
      model: () => Promise<{ default: Model }>
    }
  ) {}

  protected async getModel() {
    if (this.model && !('hot' in import.meta)) {
      return this.model
    }

    const importedModel = await this.options.model()
    this.model = importedModel.default
    return this.model
  }

  async set(key: string, internalState: T): Promise<void> {
    const model = await this.getModel()

    await model.updateOrCreate(
      { [model.primaryKey]: key },
      { value: JSON.stringify(internalState) }
    )
  }

  async get(key: string): Promise<T | undefined> {
    const model = await this.getModel()
    const record = await model.find(key)
    if (record === null) {
      return undefined
    }
    return safeParseJson(record.value) as T
  }

  async del(key: string): Promise<void> {
    const model = await this.getModel()
    await model
      .query()
      .where({ [model.primaryKey]: key })
      .delete()
  }
}

export function lucidStateStore<Model extends OAuthStateModel>(
  model: () => Promise<{ default: Model }>
): OAuthStore<Model, NodeSavedState> {
  return new OAuthStore<Model, NodeSavedState>({ model })
}

export function lucidSessionStore<Model extends OAuthSessionModel>(
  model: () => Promise<{ default: Model }>
): OAuthStore<Model, NodeSavedSession> {
  return new OAuthStore<Model, NodeSavedSession>({ model })
}
