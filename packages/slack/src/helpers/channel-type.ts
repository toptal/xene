export const channelType = (str): 'channel' | 'group' | 'direct' => {
  switch (str.substring(0, 1)) {
    case 'C': return 'channel'
    case 'G': return 'group'
    case 'D': return 'direct'
    default: return null
  }
}

export const isPrivateChannel = (id: string): boolean =>
  id.length && id[0].toLowerCase() === 'd'
