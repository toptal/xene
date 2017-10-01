import { APIModule } from './base'
import { get } from '../helpers/get'
import { File, FileUploadOptions } from '../types'

export class Files extends APIModule {
  upload = (options: Partial<FileUploadOptions>) =>
    this.request('upload', options).then(get<File>('file'))

  sharedPublicURL = (options: { file: string }) =>
    this.request('sharedPublicURL', options).then(get<File>('file'))
}
