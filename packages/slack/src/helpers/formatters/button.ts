import { IButton } from '../../api/types/message'

export const toSlack = (b: IButton) => ({
  style: b.type || 'default',
  confirm: b.confirm,
  value: b.value,
  type: 'button',
  text: b.label,
  name: b.id
})

export const fromSlack = (b): IButton => ({
  type: b.style || 'default',
  confirm: b.confirm,
  value: b.value,
  label: b.text,
  id: b.name
})
