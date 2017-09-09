export type Channel = {
  id: string
  name: string
  isChannel: boolean
  created: number
  creator: string
  isArchived: boolean
  isGeneral: boolean
  isMember: boolean
  members: string[]
  topic: {
    value: string
    creator: string
    lastSet: number
  }
  purpose: {
    value: string
    creator: string
    lastSet: number
  }
  numMembers?: number
}

export type Group = {
  id: string
  name: string
  isGroup: boolean
  created: number
  creator: string
  isArchived: boolean
  isMpim: boolean
  members: string[]
  topic: {
    value: string
    creator: string
    lastSet: number
  }
  purpose: {
    value: string
    creator: string
    lastSet: number
  }
  unreadCount?: number
  unreadCountDisplay?: number
}

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

export type Attachment = {
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

export type Message = {
  attachments?: Attachment[]
  text?: string
}

export type MessageOptions = {
  parse?: 'full' | 'none'
  asUser?: boolean
  iconUrl?: string
  username?: string
  iconEmoji?: string
  linkNames?: 1
  unfurlLinks?: boolean
  unfurlMedia?: boolean
  replyBroadcast?: boolean
  threadTs?: string
}

export type User = {
  id: string
  title: string
  handle: string
  fullName: string
  teamId: string
  color: string
  deleted: boolean
  isAdmin: boolean
  isBot: boolean
  isOwner: boolean
  isPrimaryOwner: boolean
  isRestricted: boolean
  isUltraRestricted: boolean
  profile: {
    avatarHash: string
    currentStatus: string
    email: string
    firstName: string
    image192: string
    image24: string
    image32: string
    image48: string
    image72: string
    lastName: string
    phone: string
    realName: string
    skype: string
    tz: string
    tzLabel: string
    tzOffset: number
  }
}

export type MiddlewareHandler = (context: MiddlewareContext) => void | Promise<void>

export type MiddlewareContext = {
  /**
   * Slack verification token
   */
  readonly token: string
  readonly callbackId: string
  readonly responseUrl: string
  readonly user: { id: string, name: string }
  readonly team: { id: string, domain: string }
  readonly channel: { id: string, name: string }
  readonly action: { value: string, type: 'select' | 'button', id: string }

  /**
   * Original message, all changes with this object will
   * be passed to the Slack. Assigning null or undefined
   * to this property will delete message in Slack
   * @type {IMessage}
   */
  message: Message

  /**
   * Ephemeral message that will be seen only by user
   * @type {string}
   */
  ephemeral: string | Message
}
