import { APIModule } from './base'
import { Group } from '../types'
import { get } from '../helpers/get'

export class Groups extends APIModule {
  info = (group: string) =>
    this.request('info', { group }).then(get<Group>('channel'))

  list = () =>
    this.request('list').then(get<Group[]>('groups'))
}
