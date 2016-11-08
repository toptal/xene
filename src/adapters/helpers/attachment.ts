import * as _ from 'lodash'
const ATCHMNT_COLOR = '#3aa3e3'

function formatButtons (button) {
  const name = button.label
  const value = button.value
  const style = button.type
  const confirm = button.confirm
  const text = name
  return { type: 'button', text, value, name, style, confirm }
}

function formatAttachment (attachment) {
  const title = attachment.title || ''
  return {
    title: attachment.title,
    fallback: attachment.title,
    callback_id: attachment.callbackId,
    color: ATCHMNT_COLOR,
    actions: attachment.buttons.map(formatButtons)
  }
}

export function format (attachments) {
  return attachments.map(formatAttachment)
}






function replaceAttachment (selected, attachment) {
  const selectedReplacer = ':white_check_mark: ' + selected.name
  if (_.find(attachment.actions, ['value', selected.value])) {
    const title = attachment.title
    delete attachment.actions
    attachment.title = title ? (title + '\n' + selectedReplacer) : selectedReplacer
  }
  return attachment
}

export function parse (payload) {
  const selected = payload.actions[0]
  const original = payload.original_message

  return {
    parsed: {
      message: selected.value.toLowerCase(),
      channel: payload.channel.id,
      user: payload.user.id,
      isAction: true
    },
    replaced: {
      text: original.text,
      attachments: original.attachments.map(_.partial(replaceAttachment, selected))
    }
  }
}
