import Module from './module'
import IUser from './types/user'
import converter from './converters/user'

export default class Users extends Module {

  info(idOrPartialUser: string | Partial<IUser>) {
    return super.info<IUser>(idOrPartialUser, converter)
  }

  list(filter?: Partial<IUser>) {
    return super.list<IUser>(converter, filter, 'members')
  }
}
