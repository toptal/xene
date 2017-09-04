import { UserMessage } from '../types'

export type FailureHandler = (message: string) => any

export abstract class Action {
  constructor(protected _onFailure?: FailureHandler) { }

  failed(message: UserMessage) {
    if (this.hasFailureHandler)
      this._onFailure(message.text)
  }

  get hasFailureHandler() {
    return Boolean(this._onFailure)
  }

  abstract perform(message: UserMessage): boolean
}
