import { isString, isNumber } from 'lodash'
import { IAttachment, IButton } from '../types/message'

export default function(attachment: IAttachment): IAttachment {
  const actions = [].concat(attachment.button || attachment.buttons)
  delete attachment.button
  delete attachment.buttons
  return Object.assign(
    { text: '' },
    attachment,
    { actions: actions.map(formatAction) }
  )
}

function formatAction(button: string | IButton) {
  if (isNumber(button)) button = button.toString()

  if (isString(button)) return {
    name: button,
    text: button,
    value: button,
    type: 'button',
    style: 'default'
  }

  return {
    type: 'button',
    name: button.label,
    text: button.label,
    value: button.value,
    style: button.type || 'default',
    confirm: button.confirm
  }
}
