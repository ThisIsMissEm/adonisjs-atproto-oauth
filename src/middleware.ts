import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { OAuthContext } from './oauth_context.js'

// import type { Authenticator } from '../authenticator.ts'

/**
 * The "InitializeAuthMiddleware" is used to create a request
 * specific authenticator instance for every HTTP request.
 *
 * This middleware does not protect routes from unauthenticated
 * users. Please use the "auth" middleware for that.
 *
 * @example
 * router.use([() => import('#middleware/initialize_atproto_auth_middleware')])
 */
export default class InitializeAtprotoOAuthMiddleware {
  /**
   * Handle the HTTP request by initializing the authenticator
   *
   * @param ctx - The HTTP context
   * @param next - The next function to call in the middleware chain
   *
   * @example
   * // This middleware runs automatically when registered
   * // It adds ctx.auth to every HTTP request
   */
  async handle(ctx: HttpContext, next: NextFn) {
    const oauthClient = await ctx.containerResolver.make('atproto.oauth.client')

    /**
     * Initialize the authenticator for the current HTTP
     * request
     */
    ctx.oauth = new OAuthContext(ctx, oauthClient)

    return next()
  }
}

declare module '@adonisjs/core/http' {
  export interface HttpContext {
    oauth: OAuthContext
  }
}
