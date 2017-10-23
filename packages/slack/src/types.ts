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
  realName: string
  teamId: string
  color: string
  deleted: boolean
  isAdmin: boolean
  isBot: boolean
  isOwner: boolean
  isPrimaryOwner: boolean
  isRestricted: boolean
  isUltraRestricted: boolean
  tz: string
  tzLabel: string
  tzOffset: number
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

export type FileUploadOptions = {
  channels: string[]
  content: string
  file: string
  filename: string
  filetype: string
  initialComment: string
  title: string
}

export type File = {
  id: string,
  created: number
  timestamp: number
  name: string
  title: string
  mimetype: string
  filetype: string
  prettyType: string
  user: string
  mode: string
  editable: boolean,
  isExternal: boolean
  externalType: string
  username: string
  size: number
  urlPrivate: string
  urlPrivateDownload: string
  thumb64: string
  thumb80: string
  thumb360: string
  thumb360Gif: string
  thumb360W: number
  thumb360H: number
  thumb480: string
  thumb480W: number
  thumb480H: number
  thumb160: string
  permalink: string
  permalinkPublic: string
  editLink: string
  preview: string
  previewHighlight: string
  lines: number
  linesMore: number
  isPublic: boolean
  publicUrlShared: boolean
  displayAsBot: boolean
  channels: string[]
  groups: string[]
  ims: string[]
  initialComment: {}
  numStars: number
  isStarred: boolean
  pinnedTo: string[]
  reactions: { name: string, count: number, users: string[] }[]
  commentsCount: number
}
