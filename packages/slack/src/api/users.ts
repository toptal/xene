import { APIModule } from './base'
import { User } from '../types'
import { get } from '../helpers/get'

export class Users extends APIModule {
  info = (user: string) =>
    this.request('info', { user }).then(get<User>('user'))

  list = () =>
    this.request('list').then(get<User[]>('members'))
}
