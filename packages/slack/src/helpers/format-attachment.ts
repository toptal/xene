import { isString, isNumber } from 'lodash'
import concat from './concat-values'
import { IAttachment, IButton, ISelect } from '../api/types/message'

export default function(attachment: IAttachment): IAttachment {
  const buttons: any = concat(attachment.button, attachment.buttons).map(formatButtons)
  delete attachment.button
  delete attachment.buttons
  return Object.assign({ text: '' }, attachment, {
    actions: attachment.select ?
      buttons.concat(formatSelect(attachment.select)) :
      buttons
  })
}

function formatButtons(button: string | IButton) {
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

function formatSelect(select: ISelect) {
  const optionate = ({label, value}) => ({ text: label, value})
  return {
    name: select.label,
    type: 'select',
    options: !isString(select.options) ? select.options.map(optionate) : undefined,
    data_source: isString(select.options) ? select.options : undefined,
    confirm: select.confirm
  }
}
