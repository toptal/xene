import { mapValues, isObject } from 'lodash'
import { request } from './request'
import { APIError } from '../../errors'
import { camel, snake } from '../../helpers/case'

const stringify = (object: object) =>
  mapValues(snake(object), v => isObject(v) ? JSON.stringify(v) : v)

const URI = (ns: string, method: string, token: string) =>
  `https://slack.com/api/${ns}.${method}?token=${token}`

export abstract class APIModule {
  protected namespace: string

  constructor(private token: string) {
    this.namespace = this.constructor.name.toLowerCase()
  }

  protected async request(method: string, form: object = {}) {
    const uri = URI(this.namespace, method, this.token)
    const response = await request(uri, stringify(form))
    if (!response.ok) throw new APIError(response.error)
    return camel(response)
  }
}
