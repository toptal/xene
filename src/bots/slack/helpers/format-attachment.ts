import { isString, isNumber } from 'lodash'
import { IAttachment, IButton } from '../types/message'

export default function(attach: IAttachment): any {
  const actions = [].concat(attach.button || attach.buttons)
  delete attach.button
  delete attach.buttons
  Object.assign(attach, { actions: actions.map(formatAction) })
}

function formatAction(button: string | IButton) {
  if (isNumber(button)) button = button.toString()

  if (isString(button)) return {
    name: button,
    text: button,
    value: button,
    type: 'default'
  }

  return {
    name: button.label,
    text: button.label,
    value: button.value,
    style: button.type || 'default',
    confirm: button.confirm
  }
}
