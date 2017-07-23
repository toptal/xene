import { get, map, find } from 'lodash/fp'
import { APIModule } from './base'
import { Group } from '../types'
import { camel } from './converters'

export class Groups extends APIModule {
  info(group: string | Partial<Group>): Promise<Group> {
    if (typeof group === 'string') return this.request('info', { group }).then(get('channel')).then(camel)
    return this.list().then(find(group)) as any
  }

  list(): Promise<Group[]> {
    return this.request('list').then(get('groups')).then(map(camel))
  }
}
