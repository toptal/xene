import Module from './module'
import IChannel from './types/channel'
import converter from './converters/camel'

export default class Channels extends Module {
  info(idOrPartial: string | Partial<IChannel>) {
    return super.info<IChannel>(idOrPartial, converter)
  }

  list(filter?: Partial<IChannel>) {
    return super.list<IChannel>(converter, filter)
  }

  async join(channelName: string): Promise<IChannel> {
    const response = await this.call('join', { name: channelName })
    return converter(response.channel)
  }

  async invite(channel: string, user: string) {
    const response = await this.call('invite', { channel, user })
    return converter(response.channel)
  }
}
