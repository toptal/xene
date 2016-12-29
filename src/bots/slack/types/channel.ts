interface Channel {
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

export default Channel
