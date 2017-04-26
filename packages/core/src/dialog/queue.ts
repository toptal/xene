import Dialog from './index'

export interface IAddSignature {
  parser: {
    parse: (msg: string) => any
    check: (parsed: any) => boolean
  }
  done: (msg: string) => void
  error?: (reply: string, parsed: any) => void // TODO better to return Promise<>
}

export default class Queue {
  private queue: IAddSignature[] = []
  private message: string

  push(obj: IAddSignature) {
    this.queue.push(obj)
    return this.processMessage()
  }

  resetMessage() {
    this.message = null
  }

  async processMessage(msg = this.message) {
    this.message = msg
    if (!this.queue[0] || !msg) return
    const {done, parser, error} = this.queue[0]
    const parsed = await parser.parse(msg)
    const isValid = parser.check(parsed)
    if (isValid || !error) {
      done(parsed)
      this.queue.shift()
      this.processMessage(msg)
    } else {
      error(msg, parsed)
    }
  }
}
