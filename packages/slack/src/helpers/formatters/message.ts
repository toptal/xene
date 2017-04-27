import { IMessage } from '../../api/types/message'
import * as attachmentFormat from './attachment'
import snakeize from '../../api/converters/snake'
import camelize from '../../api/converters/camel'

export function toSlack(message: IMessage) {
  let { attachments, ...rest } = message
  attachments = (attachments || []).map(attachmentFormat.toSlack)
  return snakeize({ attachments, ...rest })
}

export function fromSlack(message): IMessage {
  const { attachments, ...rest } = camelize(message)
  return { attachments: attachments.map(attachmentFormat.fromSlack), ...rest }
}
