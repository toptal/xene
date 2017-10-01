import { Message } from '../../types'
import * as attachmentFormat from './attachment'
import { snake, camel } from '../case'

export const toSlack = ({ attachments, ...rest }: Message) =>
  snake({ attachments: (attachments || []).map(attachmentFormat.toSlack), ...rest })

export const fromSlack = (message): Message => {
  const { attachments, ...rest } = camel(message)
  return { attachments: (attachments || []).map(attachmentFormat.fromSlack), ...rest }
}
