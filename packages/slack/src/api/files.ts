import { APIModule } from './base'
import { get, map, find } from 'lodash/fp'
import { camel, snake } from './converters'
import { File, FileUploadOptions } from '../types'
import * as messageFormat from '../helpers/formatters/message'

export class Files extends APIModule {
  /**
   * https://api.slack.com/methods/files.upload
   */
  upload(options: Partial<FileUploadOptions>): Promise<File> {
    return this.request('upload', snake(options)).then(get('file')).then(camel)
  }

  /**
   * https://api.slack.com/methods/files.sharedPublicURL
   */
  sharedPublicURL(options: { file: string }): Promise<File> {
    return this.request('sharedPublicURL', snake(options)).then(get('file')).then(camel)
  }
}
