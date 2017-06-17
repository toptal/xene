import * as WebSocket from 'ws'
import { EventEmitter } from 'events'

import Module from '../module'
import { On, Off } from './types'
import * as converters from '../converters'

const boundPromise = (): { resolve: (a?: any) => void, reject: () => void, promise: Promise<any> } => {
  const result = {} as any
  result.promise = new Promise((resolve, reject) => {
    result.resolve = resolve
    result.reject = reject
  })
  return result
}

export default class RTM extends Module {
  private ws: WebSocket
  private ee = new EventEmitter()
  on: On
  off: Off

  constructor(token) {
    super(token)
    this.on = this.ee.addListener.bind(this.ee)
    this.off = this.ee.removeListener.bind(this.ee)
  }

  connect = async () => {
    const promise = boundPromise()
    const response = await this.call('connect', {}, true)
    this.ws = new WebSocket(response.url)
    // handle autorecconnections on errors
    // this.ws.on('error', promise.reject)
    this.ws.on('open', () => promise.resolve(response))
    this.ws.on('message', this.emit.bind(this))
    return promise.promise
  }

  private emit(msgString: any) {
    const msg = JSON.parse(msgString)
    this.ee.emit(msg.subtype ? `${msg.type}.${msg.subtype}` : msg.type, msg)
  }
}
