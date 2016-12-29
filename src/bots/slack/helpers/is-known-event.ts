import { RTM_MESSAGE_SUBTYPES } from '@slack/client'

const KNOWN_EVENTS = {
  [RTM_MESSAGE_SUBTYPES.CHANNEL_JOIN]: 'slack.join',
  [RTM_MESSAGE_SUBTYPES.GROUP_JOIN]: 'slack.join'
}

export default (event: string): boolean => {
  return Boolean(KNOWN_EVENTS[event])
}
