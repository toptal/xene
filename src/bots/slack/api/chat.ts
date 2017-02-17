import Module from './module'
import IGroup from './types/group'
import concat from '../helpers/concat-values'
import * as converters from './converters'
import formatAttachment from '../helpers/format-attachment'
import { IMessage, IOptions as IMessageOptions } from './types/message'

export default class Chat extends Module {

  async postMessage(channel: string, message: IMessage, options: IMessageOptions = {}) {
    message.attachments = concat(message.attachments).map(formatAttachment)
    return this.call('postMessage', converters.snake({
        ...message,
        ...{ channel, asUser: true },
        ...options
      }), true)
    .then(response => converters.camel(response.message))
  }
}
