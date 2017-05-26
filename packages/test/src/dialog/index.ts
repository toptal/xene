// const tester = test.dialog(Dialog, {})
// tester.on('Some message').says('')
// tester.on('Some message').says('')
import { Bot, Dialog } from '@xene/core'
import { isEqual } from 'lodash'

export class Testbot extends Bot<any, any>{
  constructor(dialog: typeof Dialog, private user: any, private tester: Tester) {
    super({ dialogs: [dialog] })
  }

  formatMessage(message: any, object: any) { return message }
  getUser(id: string) { return this.user }

  async sendMessage(chat: string, message: any) {
    this.tester.response(message)
    return Promise.resolve()
  }
}

export class Expectation {
  /** @internal */
  resolve: () => void
  /** @internal */
  reject: (err:any) => void
  /** @internal */
  botMessages: any[] = []
  /** @internal */
  expectedMessages: any[]
  /** @internal */
  userMessage: string
  constructor(userMessage) { this.userMessage = userMessage }
  expect<T extends any>(message: T | T[]) {
    this.expectedMessages = [].concat(message)
    return new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }
  check(botMessage: any) {
    this.botMessages.push(botMessage)
    const canCompare = this.expectedMessages.length === this.botMessages.length
    if (!canCompare) return false
    if (isEqual(this.expectedMessages, this.botMessages)) this.resolve()
    else this.reject('Dialog\'s messages don\'t match with messages send')
    return true
  }
}

export class Tester {
  private testbot: Testbot
  private expectations: Expectation[] = []
  constructor(dialogClass: typeof Dialog, private user: any) {
    this.testbot = new Testbot(dialogClass, user, this)
  }

  on(message: string) {
    const expectation = new Expectation(message)
    this.expectations.push(expectation)
    if (this.expectations.length === 1) this.sendMessage(message)
    return expectation
  }

  /** @internal */
  async response(message: any) {
    const expectation = this.expectations[0]
    if (!await expectation.check(message)) return
    this.expectations.shift()
    if (this.expectations.length > 0)
      this.sendMessage(this.expectations[0].userMessage)
  }

  private sendMessage(text: string) {
    this.testbot.onMessage({ id: '', text, user: '', chat: '' })
  }
}

export default function dialog(dialogClass: typeof Dialog, user: any) {
  return new Tester(dialogClass, user)
}
