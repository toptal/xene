import { get, map, filter, find } from 'lodash/fp'
import Base from './base'
import IGroup from './types/group'
import converter from './converters/camel'

export default class Groups extends Base {
  info(group: string | Partial<IGroup>): Promise<IGroup> {
    if (typeof group === 'string') return this.request('info', { group }).then(get('channel'))
    return this.list().then(find(group)) as any
  }

  list(): Promise<IGroup[]> {
    return this.request('list').then(get('groups')).then(map(converter))
  }
}
