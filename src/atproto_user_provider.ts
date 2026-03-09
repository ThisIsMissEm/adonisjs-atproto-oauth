import type { SessionGuardUser, SessionUserProviderContract } from '@adonisjs/auth/types/session'
import app from '@adonisjs/core/services/app'
import logger from '@adonisjs/core/services/logger'
import { symbols } from '@adonisjs/auth'
import { AtprotoUser } from './atproto_user.ts'
import { TokenRefreshError } from '@atproto/oauth-client-node'

export class AtprotoUserProvider implements SessionUserProviderContract<AtprotoUser> {
  declare [symbols.PROVIDER_REAL_USER]: AtprotoUser
  /**
   * Create a user object that acts as an adapter between
   * the guard and real user value.
   */
  async createUserForGuard(user: AtprotoUser): Promise<SessionGuardUser<AtprotoUser>> {
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
      const user = new AtprotoUser(session)

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

export const atprotoUserProvider = new AtprotoUserProvider()

/**
 * @deprecated
 */
export const atprotoAuthProvider = atprotoUserProvider
