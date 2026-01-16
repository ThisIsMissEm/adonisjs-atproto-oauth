import app from '@adonisjs/core/services/app'
import logger from '@adonisjs/core/services/logger'
import { symbols } from '@adonisjs/auth'
import { SessionGuardUser, SessionUserProviderContract } from '@adonisjs/auth/types/session'
import { AtProtoUser } from './atproto_user.js'
import { TokenRefreshError } from '@atproto/oauth-client-node'

export class AtProtoProvider implements SessionUserProviderContract<AtProtoUser> {
  declare [symbols.PROVIDER_REAL_USER]: AtProtoUser
  /**
   * Create a user object that acts as an adapter between
   * the guard and real user value.
   */
  async createUserForGuard(user: AtProtoUser): Promise<SessionGuardUser<AtProtoUser>> {
    return {
      getId() {
        return user.did
      },
      getOriginal() {
        return user
      },
    }
  }
  /**
   * Find a user by their id.
   */
  async findById(identifier: string) {
    const oauth = await app.container.make('atproto.oauth.client')

    try {
      const session = await oauth.client.restore(identifier)
      const user = new AtProtoUser(session)

      return this.createUserForGuard(user)
    } catch (err) {
      // If we fail to restore the session, return no user login:
      if (err instanceof TokenRefreshError) {
        return null
      }

      logger.warn(err, `Failed to restore session for: ${identifier}`)
      return null
    }
  }
}

export const atprotoAuthProvider = new AtProtoProvider()
