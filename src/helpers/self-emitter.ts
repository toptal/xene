import {EventEmitter} from 'events'

interface BoundMethod {
  method: (any) => any
  event: string
}

export default class SelfEmitter extends EventEmitter {
  private _toBind: BoundMethod[]

  constructor () {
    super()
    this.__selfBind()
  }

  __selfBind () {
    this._toBind.map(b => {
      this.on(b.event, b.method.bind(this))
    })
  }

  static on (event: string) {
    return (target, key: string, descriptor: PropertyDescriptor) => {
      const method = descriptor.value
      target._toBind = (target._toBind || []).concat({ event, method })
      return descriptor
    }
  }
}
