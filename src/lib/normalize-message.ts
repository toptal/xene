import { isNumber, isString, isPlainObject } from 'lodash'
import { default as IMessage, IButton, IAttachment } from '../types/bot-message'

export default (obj: string | IMessage): { text: string, attachments: IAttachment[] } => {
  if (isString(obj)) return { text: obj, attachments: [] }
  else if (isPlainObject(obj)) return fromObject(obj)
}

function fromObject(partial: IMessage): { text: string, attachments: IAttachment[] } {
  let {attachment, attachments} = partial
  if (attachment) attachments = [attachment]
  return {
    attachments: (attachments || []).map(normalizeAttachment),
    text: partial.text
  }
}

function normalizeAttachment(attachment: IAttachment): IAttachment {
  return {
    title: attachment.title || '',
    body: attachment.body || '',
    buttons: (attachment.buttons || []).map(normalizeButton)
  }
}

function normalizeButton(button: string | IButton): IButton {
  if (!isPlainObject(button)) button = button.toString()

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
