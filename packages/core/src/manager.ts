import { Bot } from './bot'
import { IManager } from './chat'
import { Parser } from './parser'
import { Question } from './question'
import { UserMessage } from './types'

const isQuestion = (q): q is Question =>
  q instanceof Question

export class Manager implements IManager {
  private _queue: (Parser | Question)[] = []
  private _messages: UserMessage[] = []

  constructor(
    private _bot: Bot,
    private _chatId: string,
    public users: string[]
  ) { }

  /**
   * For questions call to ask is required and so it
   * should be just added to the end of queue until
   * previous question/parsers finish.
   *
   * For Parser there no need to prepare it
   * and it's possible just to parse last message
   * since it may contain info parser tries to get
   * (unlike questions, which need to ask question
   * before parsing). So call to parse here will do
   * almost the same thing as in perform but without
   * triggering error hander of parser to not mess
   * up with queue. If it fails then same flow applied
   * as for question e.g. add to queue.
   */
  add(action: Parser | Question) {
    if (isQuestion(action)) {
      this._queue.push(action)
      return this._chat.add(this)
    }

    if (this._lastMessage && action.parse(this._lastMessage)) return
    if (!this._queue.some(isQuestion)) this._chat.add(this)
    this._queue.push(action)
  }

  prepare() {
    if (isQuestion(this._head)) this._head.ask()
    else this._head.error(this._lastMessage)
  }

  perform(message: UserMessage) {
    this._messages.push(message)
    if (this._isEmpty) return true
    const wasParsed = this._head.parse(message)
    if (!wasParsed) {
      this._head.error(message)
      return false
    }
    this._queue.shift()
    if (isQuestion(this._head)) return true
    else return this.perform(message)
  }

  private get _lastMessage() { return this._messages[this._messages.length - 1] }
  private get _chat() { return this._bot._chatFor(this._chatId) }
  private get _isEmpty() { return this._queue.length === 0 }
  private get _head() { return this._queue[0] }
}
