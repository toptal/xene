import { Action, FailureHandler } from './action'

export class Pause extends Action {
  constructor(onFailure: FailureHandler) { super(onFailure) }
  perform() { return false }
}
