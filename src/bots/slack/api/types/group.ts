interface IGroup {
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

export default IGroup
