import { APIModule } from './base'
import { request } from './base/request'
import { camel } from '../helpers/case'
import { APIError } from '../errors'

export class Oauth extends APIModule {
  static async access(options: { id: string, secret: string, code: string, redirectUri?: string }) {
    const uri = `https://slack.com/api/oauth.access`
    const form = {
      client_id: options.id,
      client_secret: options.secret,
      code: options.code,
      redirect_uri: options.redirectUri
    }
    const response = await request(uri, form, options.secret)
    if (!response.ok) throw new APIError(response.error)
    return camel(response)
  }
}
