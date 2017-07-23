import { get, map, find } from 'lodash/fp'
import { APIModule } from './base'
import { User } from '../types'
import * as converter from './converters'

export class Users extends APIModule {
  info(user: string | Partial<User>): Promise<User> {
    if (typeof user === 'string') return this.request('info', { user }).then(get('user')).then(converter.user)
    return this.list().then(find(user)) as any
  }

  list(): Promise<User[]> {
    return this.request('list').then(get('members')).then(map(converter.user))
  }
}
