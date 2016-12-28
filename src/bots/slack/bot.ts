import * as uuid from 'uuid'
import Bot from '../../lib/bot'
import IAttachment from './attachment-type'

export type Message = string | {
  text?: string
  attachment?: IAttachment
  attachments?: IAttachment[]
}

export default class Slackbot extends Bot<Message, any> {

  formatMessage(message: Message, object: any): Message {
    return {text: 's'}
  }

  async user() {
    return {
      name: 'dempfi'
    }
  }

  async users() {
    return [{
      name: 'dempfi'
    }]
  }

  async send(chat: string, message: Message) {

  }
}
