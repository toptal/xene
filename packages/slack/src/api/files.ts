import { APIModule } from './base'
import { camel, snake } from './converters'
import { Message, MessageOptions } from '../types'
import * as messageFormat from '../helpers/formatters/message'

export class Files extends APIModule {
  /**
   * https://api.slack.com/methods/files.upload
   */
  upload(options = {}) {
    return this.request('upload', snake(options)).then(camel)
  }

  /**
   * https://api.slack.com/methods/files.sharedPublicURL
   */
  sharedPublicURL(options = {}) {
    return this.request('sharedPublicURL', snake(options)).then(camel)
  }
}
