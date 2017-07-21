import { get, map, find } from 'lodash/fp'
import Base from './base'
import IUser from './types/user'
import converter from './converters/user'

export default class Users extends Base {
  info(user: string | Partial<IUser>): Promise<IUser> {
    if (typeof user === 'string') return this.request('info', { user }).then(get('user')).then(converter)
    return this.list().then(find(user)) as any
  }

  list(): Promise<IUser[]> {
    return this.request('list').then(get('members')).then(map(converter))
  }
}
