import Base from './base'
import IChannel from './types/channel'
import converter from './converters/camel'

export default class Channels extends Base {
  info(idOrPartial: string | Partial<IChannel>) {
    return super.info<IChannel>(idOrPartial, converter)
  }

  list(filter?: Partial<IChannel>) {
    return super.list<IChannel>(converter, filter)
  }

  async join(channelName: string): Promise<IChannel> {
    const response = await this.call('join', { name: channelName }, true)
    return converter(response.channel)
  }

  async invite(channel: string, user: string) {
    const response = await this.call('invite', { channel, user }, true)
    return converter(response.channel)
  }
}
