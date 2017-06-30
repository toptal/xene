import { mapValues, isObject, isString, find, filter, trimEnd } from 'lodash'
import * as Errors from '../errors'
import * as request from 'request-promise-native'

const RATE = 2000

abstract class ApiModule {
  namespace: string

  private cache: Map<string, { time: number, value: any}> = new Map()

  constructor(private token: string) {
    this.namespace = this.constructor.name.toLowerCase()
  }

  protected async call(method, form: any = {}, force: boolean = false): Promise<any> {
    const uri = `https://slack.com/api/${this.namespace}.${method}?token=${this.token}`
    form = mapValues(form, v => isObject(v) ? JSON.stringify(v) : v)
    return force ? this.forceCall(uri, form) : this.callFromCache(uri, form)
  }

  protected info<T>(
    idOrFilter: string | Partial<T>,
    converter: (a: any) => T,
    keys: { arg?: string, response?: string} = {}
  ): Promise<T> {
    keys = { arg: trimEnd(this.namespace, 's'), response: trimEnd(this.namespace, 's'), ...keys }
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

  private callFromCache(uri: string, form: any) {
    const now = new Date().valueOf()
    const key = uri + JSON.stringify(form)
    const cached = this.cache.get(key)
    if (cached && cached.time > (now - RATE)) return cached.value
    const result = this.forceCall(uri, form)
    this.cache.set(key, { time: now, value: result })
    return result
  }

  private async forceCall(uri: string, form: any) {
    try {
      const response = await request.post({ uri, json: true, form })
      if (!response.ok) throw new Errors.API(response.error)
      return response
    } catch (e) {
      throw e
    }
  }
}

export default ApiModule
