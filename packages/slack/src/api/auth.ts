import { APIModule } from './base'
import request from './base/request'
import { camel } from './converters'
import { APIError } from '../errors'

export class Auth extends APIModule {
  static async access(options: { id: string, secret: string, code: string, redirectUri?: string }) {
    const uri = `https://slack.com/api/oauth.access`
    const form = {
      client_id: options.id,
      client_secret: options.secret,
      code: options.code,
      redirect_uri: options.redirectUri
    }
    try {
      const response = await request(uri, form)
      if (!response.ok) throw new APIError(response.error)
      return camel(response)
    } catch (e) {
      throw e
    }
  }
}
