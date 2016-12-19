import { isNumber, isString } from 'lodash'
import {
  Button,
  RelaxedButton,
  RelaxedAttachment,
  Attachment,
  PartialMessage,
  default as Message
} from '../../types/messages/bot'

export default (obj: PartialMessage | string, options: any): Message => {
  const predicate = formatAttachment.bind(null, options)
  const partial = isString(obj) ? fromString(obj) : fromObject(obj)
  return {
    attachments: partial.attachments.map<Attachment>(predicate),
    text: formatString(partial.text, options)
  }
}

function fromString (str: string): PartialMessage {
  return { text: str, attachments: [] }
}

function fromObject (partial: PartialMessage): PartialMessage {
  let {attachment, attachments} = partial
  if (attachment) attachments = [attachment]
  return {
    attachments: attachments || [],
    text: partial.text
  }
}

function formatAttachment (options: any, attachment: RelaxedAttachment): Attachment {
  const title = formatString(attachment.title || '', options)
  const buttons = (attachment.buttons || []).map(formatButton)
  return { title, buttons }
}

function formatButton (button: string | RelaxedButton): Button {
  if (isNumber(button)) button = button.toString()

  if (isString(button)) return {
    label: button,
    value: button,
    type: 'default'
  }

  return {
    label: button.label,
    value: button.value || button.label,
    type: button.type || 'default',
    confirm: button.confirm
  }
}
