export default (str): 'channel' | 'group' | 'direct' => {
  switch (str.substring(0, 1)) {
    case 'C': return 'channel'
    case 'G': return 'group'
    case 'D': return 'direct'
    default: return null
  }
}

export function isPrivateChannel (id: string): boolean {
  return id.substring(0, 1).toLowerCase() === 'd'
}
