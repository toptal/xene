import { mapValues, isObject } from 'lodash'
import { request } from './request'
import { APIError } from '../../errors'
import { camel, snake } from '../../helpers/case'

const stringify = (object: object) =>
  mapValues(snake(object), v => isObject(v) ? JSON.stringify(v) : v)

const SLACK_API_URL = process.env.XENE_SLACK_API_URL || 'https://slack.com/api'
const URI = (ns: string, method: string) =>
  `${SLACK_API_URL}/${ns}.${method}`

export abstract class APIModule {
  protected namespace: string

  protected get token(): string {
    if (typeof this.tokens === 'string') return this.tokens
    return this.tokens.appToken || this.tokens.botToken
  }

  constructor(protected tokens: string | { appToken?: string, botToken?: string }) {
    this.namespace = this.constructor.name.toLowerCase()
  }

  protected async request(method: string, form: object = {}, retriable: boolean = false) {
    const uri = URI(this.namespace, method)
    const response = await request(uri, stringify(form), this.token, retriable)
    if (!response.ok) throw new APIError(response.error)
    return camel(response)
  }
}
