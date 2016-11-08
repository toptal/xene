import Bot from '../bot'
import { QueryReturn } from './query'
import {
  PartialMessage,
  PartialMessageResolver
} from '../types/messages/bot'
import { Parse, Parser, ParserOptions } from './parse'

export interface QuestionOptions extends ParserOptions {
  parser: Parser
}

export class Question extends Parse {
  question: PartialMessage | PartialMessageResolver | string
  isMessageSend: boolean = false

  constructor (question, options) {
    super(options.parser, options)
    this.question = question
    this.errorMessage = options.errorMessage || question
  }

  handle (state: Object, bot: Bot, message: string): QueryReturn {
    if (this.skipStep(state, bot)) {
      return this.skippingState
    }

    if (!this.isMessageSend) {
      console.log('sendMessage')
      this.isMessageSend = true
      return this.returnValue({
        message: this.formatMessage(this.question, state),
        done: false,
        exit: false
      })
    }

    return super.handle(state, bot, message)
  }
}

export default (
  message:  PartialMessage | PartialMessageResolver | string,
  options: QuestionOptions
): () => Question => {
  if (!options.validator && !options.validators) {
    throw new Error('Query builder `question` called without any `validator`.')
  }
  return () => new Question(message, options)
}
