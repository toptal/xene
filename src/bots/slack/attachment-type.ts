export interface IButton {
  label: string
  value: string
  type?: 'default' | 'danger' | 'primary'
  confirm?: any
}

export interface IAttachment {
  title?: string
  body?: string
  buttons?: (string | IButton)[]
}
export default IAttachment
