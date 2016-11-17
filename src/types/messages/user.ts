type Message = {
  id: string
  text: string
  user: string
  chat: string
  type: 'direct' | 'channel' | 'group'
}

export default Message
