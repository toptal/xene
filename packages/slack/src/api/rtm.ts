import * as WebSocket from 'ws'
import Module from './module'
import * as converters from './converters'

const boundPromise = (): { resolve: (a?: any) => void, reject: () => void, promise: Promise<any> } => {
  const result = {} as any
  const promise = new Promise((resolve, reject) => {
    result.resolve = resolve
    result.reject = reject
  })
  return result
}

export default class RTM extends Module {
  private ws: WebSocket

  connect = async () => {
    const promise = boundPromise()
    const response = await this.call('connect', {}, true)
    this.ws = new WebSocket(response.url)
    this.ws.on('error', promise.reject)
    this.ws.on('open', () => promise.resolve(response))
    this.ws.on('message', this.reemit) // use internal typed emmiter
    return promise.promise
  }

}
