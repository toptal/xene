import { mapValues, isObject, isString, find, filter, trimEnd } from 'lodash'
import * as Errors from '../errors'
import * as request from 'request-promise-native'

abstract class ApiModule {
  namespace: string

  constructor(private token: string) {
    this.namespace = this.constructor.name.toLowerCase()
  }

  protected async call(method, form: any = {}): Promise<any> {
    const uri = `https://slack.com/api/${this.namespace}.${method}?token=${this.token}`
    form = mapValues(form, v => isObject(v) ? JSON.stringify(v) : v)
    try {
      const response = await request.post({ uri, json: true, form })
      if (!response.ok) throw new Errors.API(response.error)
      return response
    } catch (e) {
      throw e
    }
  }

  protected info<T>(
    idOrFilter: string | Partial<T>,
    converter: (a: any) => T,
    keys: { arg?: string, response?: string} = {}
  ): Promise<T> {
    keys = Object.assign({
      arg: trimEnd(this.namespace, 's'),
      response: trimEnd(this.namespace, 's')
    }, keys)
    if (isString(idOrFilter)) {
      return this.call('info', { [keys.arg]: idOrFilter })
        .then(response => converter(response[keys.response]))
    } else {
      return this.list(converter).then(a => find(a, idOrFilter))
    }
  }

  protected list<T>(
    converter: (a: any) => T,
    partial?: Partial<T>,
    responseKey: string = this.namespace
  ): Promise<T[]> {
    return this.call('list')
      .then(response => {
        const allItems = response[responseKey].map(converter)
        return partial ? filter(allItems, partial) : allItems
      })
  }
}

export default ApiModule
