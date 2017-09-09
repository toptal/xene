export type CB = (...args: any[]) => any


export class EventEmitter {
  private _subscribers = new Map<string, CB[]>()
  on = (event: string, cb: CB) => {
    const existing = this._subscribers.get(event) || []
    existing.push(cb)
    this._subscribers.set(event, existing)
  }

  emit = (event: string, ...args: any[]) => {
    const existing = this._subscribers.get(event) || []
    existing.forEach(cb => cb(...args))
  }
}
