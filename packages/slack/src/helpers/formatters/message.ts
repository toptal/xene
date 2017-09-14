import { Message } from '../../types'
import * as attachmentFormat from './attachment'
import { snake, camel } from '../../api/converters'

export function toSlack(message: Message) {
  const { attachments, ...rest } = message
  return snake({ attachments: (attachments || []).map(attachmentFormat.toSlack), ...rest })
}

export function fromSlack(message): Message {
  const { attachments, ...rest } = camel(message)
  return { attachments: (attachments || []).map(attachmentFormat.fromSlack), ...rest }
}
