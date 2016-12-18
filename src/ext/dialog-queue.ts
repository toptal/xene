export interface AddSignature {
  parser: {
    parse: (msg: string) => any
    check: (parsed: any) => boolean
  }
  done: (msg: string) => void
  error: (reply: string, parsed: any) => void // TODO better to return Promise<>
}

export default class DialogQueue {
  private queue: AddSignature[] = []
  private message: string

  push(obj: AddSignature) {
    this.queue.push(obj)
    this.input()
  }

  resetMessage() {
    this.message = null
  }

  input(msg = this.message) {
    this.message = msg
    if (!this.queue[0] || !msg) return
    const {done, parser, error} = this.queue[0]
    const parsed = parser.parse(msg)
    const isValid = parser.check(parsed)
    if (isValid) {
      done(parsed)
      this.queue.shift()
      this.input(msg)
    } else {
      error(msg, parsed)
    }
  }

}
