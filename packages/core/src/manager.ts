import { Bot } from './bot'
import { IManager } from './channel'
import { EventEmitter } from './ee'
import { UserMessage } from './types'
import { Parse } from './actions/parse'
import { Pause } from './actions/pause'
import { Action } from './actions/action'
import { Question } from './actions/question'

const isPause = (p): p is Pause => p instanceof Pause
const isParse = (p): p is Parse => p instanceof Parse
const isQuestion = (q): q is Question => q instanceof Question

export class Manager implements IManager {
  /** @internal */
  _ee = new EventEmitter()
  emit = this._ee.emit
  on = this._ee.on

  private _queue: Action[] = []
  private _messages: UserMessage[] = []

  constructor(
    private _bot: Bot,
    private _channelID: string,
    public users: string[]
  ) {
    this._channel.bind(this)
  }

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
  add(action: Action) {
    if (isQuestion(action) || isPause(action)) {
      this._queue.push(action)
      return this._channel.add(this)
    }

    if (this._lastMessage && action.perform(this._lastMessage)) return
    else this._queue.push(action)
    if (!this._queue.some(isQuestion)) this._channel.add(this)
  }

  prepare() {
    if (isQuestion(this._head)) this._head.ask()
    else if (isPause(this._head)) return
    else this._head.failed(this._lastMessage)
  }

  perform(message: UserMessage) {
    this.emit('incomingMessage', message)
    this._messages.push(message)
    if (this._isEmpty) return true
    if (!this._head.perform(message)) {
      this._head.failed(message)
      return false
    }
    this._queue.shift()
    if (isQuestion(this._head)) return true
    else return this.perform(message)
  }

  unpause() {
    this._queue = this._queue.filter(p => !isPause(p))
  }

  abort() {
    this.emit('abort')
  }

  unbind() {
    this._channel.without(this)
  }

  private get _lastMessage() { return this._messages[this._messages.length - 1] }
  private get _channel() { return this._bot._channelFor(this._channelID) }
  private get _isEmpty() { return this._queue.length === 0 }
  private get _head() { return this._queue[0] }
}
