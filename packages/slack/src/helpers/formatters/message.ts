import { Message } from '../../api/types/message'
import * as attachmentFormat from './attachment'
import snakeize from '../../api/converters/snake'
import camelize from '../../api/converters/camel'

export function toSlack(message: Message) {
  const { attachments, ...rest } = message
  return snakeize({ attachments: (attachments || []).map(attachmentFormat.toSlack), ...rest })
}

export function fromSlack(message): Message {
  const { attachments, ...rest } = camelize(message)
  return { attachments: attachments.map(attachmentFormat.fromSlack), ...rest }
}
