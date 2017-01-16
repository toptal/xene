export interface IButton {
  label: string
  value: string
  type?: 'default' | 'danger' | 'primary'
  confirm?: {
    title: string
    text: string
    okText: string
    dismissText: string
  }
}

export interface IAttachment {
  text?: string
  title?: string
  color?: string
  pretext?: string
  titleLink?: string
  authorName?: string
  authorLink?: string
  authorIcon?: string
  callbackId?: string
  buttons?: (string | IButton)[]
  button?: string | IButton
  fields?: {
    title: string
    value: string
    short?: boolean
  }[]
  imageUrl?: string
  thumbUrl?: string
  footer?: string
  footerIcon?: string
}

export interface IMessage {
  text?: string
  attachment?: IAttachment
  attachments?: IAttachment[]
}

export interface IOptions {
  parse?: 'full' | 'none'
  asUser?: boolean
  iconUrl?: string
  username?: string
  iconEmoji?: string
  linkNames?: 1
  unfurlLinks?: boolean
  unfurlMedia?: boolean
}
