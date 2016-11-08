import * as _ from 'lodash'
import {
  Button,
  RelaxedButton,
  RelaxedAttachment,
  Attachment,
  PartialMessage,
  default as Message
} from '../types/messages/bot'

export default (message: PartialMessage | string, chat: string): Message => {
  console.log('send message', message)
  if (_.isString(message)) {
    return {text: message, chat, attachments: []}
  }
  const attachments = [].concat(message.attachment || message.attachments || [])
  return {
    chat,
    text: message.text || '',
    attachments: attachments.map<Attachment>(formatAttachment)
  }
}

function formatAttachment (attachment: RelaxedAttachment): Attachment {
  const title = attachment.title || ''
  const buttons = (attachment.buttons || []).map(formatButton)
  return { title, buttons }
}

function formatButton (button: string | RelaxedButton): Button {
  button = _.isNumber(button) ? button.toString() : button

  if (_.isString(button)) {
    return { label: button, value: button, type: 'default' }
  }

  return {
    label: button.label,
    value: button.value || button.label,
    type: button.type || 'default',
    confirm: button.confirm
  }
}
