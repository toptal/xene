import * as _ from 'lodash'
import Bot from '../bot'
import {
  PartialMessage,
  PartialMessageResolver
} from '../types/messages/bot'

const DEFAULTS = {
  done: true,
  exit: false,
  storeAs: null,
  nextStep: null,
  nextTopic: null
}

const OPTIONS = [
  'exit',
  'storeAs',
  'nextStep',
  'nextTopic'
]

export interface QueryOptions {
  step?: string
  exit?: boolean
  storeAs?: string
  nextStep?: string
  nextTopic?: string
  skipStep?: (state: any, bot: Bot) => boolean
}

export type QueryReturn = {
  done: boolean
  exit: boolean
  value?: any
  storeAs?: string | symbol
  nextStep?: string
  nextTopic?: string
  message: string | PartialMessage
}

export type PartialQueryReturn = {
  done?: boolean
  exit?: boolean
  value?: any
  storeAs?: string | symbol
  nextStep?: string
  nextTopic?: string
  message?: string | PartialMessage
}

const alwaysFalse = () => false

abstract class Query {
  step: string
  _options: QueryOptions
  skipStep: (state: any, bot: Bot) => boolean

  constructor (options: QueryOptions = {}) {
    this.step = options.step || ''
    this._options = options
    this.skipStep = options.skipStep || alwaysFalse
  }

  abstract handle (state: any, bot: Bot, message: any): Promise<QueryReturn> | QueryReturn

  returnValue (options: PartialQueryReturn = {}): QueryReturn {
    const requiredOptions = _.pick<QueryReturn, QueryOptions>(this._options, OPTIONS)
    const result: QueryReturn = _.merge({}, DEFAULTS, requiredOptions, options)
    return result
  }

  get errorExit () {
    return {
      exit: true,
      error: true
    }
  }

  get skippingState () {
    return this.returnValue({ done: true, exit: false })
  }

  formatMessage (message: PartialMessageResolver | PartialMessage | string, state: any): PartialMessage | string  {
    return _.isFunction(message) ? message(state) : message
  }
}

export default Query
