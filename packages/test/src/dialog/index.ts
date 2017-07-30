// const tester = test.dialog(Dialog, {})
// await tester.userSays('Some message')
// await tester.botSays('Some message')
// tester.on('Some message').says('')
import { Bot, DialogFactory } from '@xene/core'
import { isEqual } from 'lodash'

const testbot = (dialog: DialogFactory<Bot>, bot: typeof Bot, tester) => {
  class Testbot extends bot<any, any>{
    constructor(dialog: DialogFactory<Bot>, private tester: Tester) {
      super({ dialogs: [dialog] })
    }

    formatMessage(message: any, object: any) { return message }

    async sendMessage(chat: string, message: any) {
      this.tester.onResponse(message)
      return Promise.resolve()
    }
  }
  return new Testbot(dialog, tester)
}

class Pointer {
  resolve: Function
  reject: Function
  promise: Promise<any>
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }
}

class MessageExpectation extends Pointer {
  constructor(public message: any) { super() }
  verify(message) {
    if (isEqual(this.message, message)) this.resolve()
    else this.reject(`Messages don't match:\nExpected: ${this.message}\nGot: ${JSON.stringify(message)}`)
  }
}

export class Tester {
  private testbot: Bot<any, any>
  private userPointer: Pointer
  private botMessages: any[] = []
  private botExpectations: MessageExpectation[] = []
  user: { says: (message: string) => Promise<void> }
  bot: { says: (message: any) => Promise<void> }

  constructor(dialogClass: DialogFactory<Bot>, bot: typeof Bot, private dialogUser: any) {
    const dialog = this.bind(dialogClass)
    this.testbot = testbot(dialog as any, bot, this)
    this.user = { says: this.userSays.bind(this) }
    this.bot = { says: this.botSays.bind(this) }
  }

  private userSays(message: string) {
    this.userPointer = new Pointer()
    this.sendMessage(message)
    return this.userPointer.promise
  }

  private botSays(message: any) {
    const expected = new MessageExpectation(message)
    const lastMessage = this.botMessages.shift()
    if (!lastMessage) this.botExpectations.push(expected)
    else expected.verify(lastMessage)
    return expected.promise
  }

  /** @internal */
  async onResponse(message: any) {
    this.userPointer && this.userPointer.resolve()
    const expected = this.botExpectations.shift()
    if (!expected) return this.botMessages.push(message)
    else expected.verify(message)
  }

  private async onEnd(error?: any) {
    if (this.userPointer) return error ? this.userPointer.reject(error) : this.userPointer.resolve()
    const expectation = this.botExpectations.shift()
    if (expectation && error) expectation.reject(error)
  }

  private sendMessage(text: string) {
    this.testbot.onMessage({ id: '', text, user: this.dialogUser, chat: '' })
  }

  private bind(dialogClass: DialogFactory<Bot>) {
    const onEnd = this.onEnd.bind(this)
    const originalOnEnd = dialogClass.prototype.onEnd
    const originalOnAbort = dialogClass.prototype.onAbort
    dialogClass.prototype.onEnd = function () { originalOnEnd.call(this); onEnd() }
    dialogClass.prototype.onAbort = function (e) { originalOnAbort.call(this, e); onEnd(e) }
    return dialogClass
  }
}

export default function dialog(dialogClass: DialogFactory<Bot>, bot: typeof Bot, user: any) {
  return new Tester(dialogClass, bot, user)
}
