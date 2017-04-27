import { isString } from 'lodash'
import { IMenu } from '../../api/types/message'

const optionToSlack = ({ label, value }) => ({ text: label, value })
const optionFromSlack = ({ text, value }) => ({ label: text, value })

export const toSlack = (s: IMenu) => ({
  options: !isString(s.options) ? s.options.map(optionToSlack) : undefined,
  data_source: isString(s.options) ? s.options : undefined,
  confirm: s.confirm,
  type: 'select',
  text: s.label,
  name: s.id
})

export const fromSlack = (s): IMenu => ({
  options: s.options ? s.options.map(optionFromSlack) : s.data_source,
  confirm: s.confirm,
  label: s.name,
  id: s.name
})
