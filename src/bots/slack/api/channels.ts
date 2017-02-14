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

  async join(channelId: string): Promise<IChannel> {
    const response = await this.call('join', { name: channelId })
    return converter(response.channel)
  }
}
