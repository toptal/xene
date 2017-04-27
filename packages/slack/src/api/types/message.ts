export interface IAction {
  confirm?: { title: string, text: string, okText: string, dismissText: string }
  label: string
  id: string
}

export interface IButton extends IAction {
  type?: 'default' | 'danger' | 'primary'
  value: string
}

export interface IMenu extends IAction {
  options: 'users' | 'channels' | { label: string, value: string }[]
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
  mrkdwnIn?: string[]
  buttons?: IButton[]
  menus?: IMenu[]
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
  attachments?: IAttachment[]
  text?: string
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
