import Bot from '../bot'
import { QueryReturn, QueryOptions, default as Query } from './query'

export interface ActionOptions extends QueryOptions {
  onError?: string
  onSuccess?: string
}

export class Action extends Query {
  action: (state: any, bot: Bot) => Promise<any>
  onError?: string
  onSuccess?: string

  constructor (action: (state: any, bot: Bot) => any | Promise<any>, options: ActionOptions) {
    super(options)
    this.action = action
    this.onError = options.onError || null
    this.onSuccess = options.onSuccess || options.nextStep
  }

  async handle (state: any, bot: Bot, message: string): Promise<QueryReturn> {
    if (this.skipStep(state, bot)) {
      return this.skippingState
    }

    try {
      const value = await this.action(state, bot)
      return this.returnValue({ nextStep: this.onSuccess, value })
    } catch (e) {
      console.error(e)
      if (this.onError) {
        return this.returnValue({ nextStep: this.onError, done: true })
      }
      throw e
    }
  }
}

export default (action: (state: any, bot: Bot) => any | Promise<any>, options: ActionOptions = {}): () => Action => {
  return () => new Action(action, options)
}
