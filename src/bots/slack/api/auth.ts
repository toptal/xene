import Module from './module'
import converter from './converters/camel'
import * as Errors from '../errors'
import * as request from 'request-promise-native'

export default class Auth extends Module {
  static async access(options: { id: string, secret: string, code: string, redirectUri?: string }) {
    const uri = `https://slack.com/api/oauth.access`
    const form = {
      client_id: options.id,
      client_secret: options.secret,
      code: options.code,
      redirect_uri: options.redirectUri
    }
    try {
      const response = await request.post({ uri, json: true, form })
      if (!response.ok) throw new Errors.API(response.error)
      return converter(response)
    } catch (e) {
      throw e
    }
  }
}
