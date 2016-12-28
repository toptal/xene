interface Message {
  text: string
  attachments?: {
    text?: string
    title?: string
    color?: string
    pretext?: string
    fallback?: string
    titleLink?: string
    authorName?: string
    authorLink?: string
    authorIcon?: string
    fields?: {
      title: string
      value: string
      short?: boolean
    }[]
    imageUrl?: string
    thumbUrl?: string
    footer?: string
    footerIcon?: string
    ts?: number
  }[]
}

interface MessageOptions {
  parse?: 'full' | 'none'
  linkNames?: 1
  unfurlLinks?: boolean
  unfurlMedia?: boolean
  username?: string
  asUser?: boolean
  iconUrl?: string
  iconEmoji?: string
}

export {MessageOptions}
export default Message
