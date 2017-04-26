import * as _ from 'lodash'
import IUser from '../types/user'

function transformer(result, value, key): IUser {
  switch (key) {
    case 'id':
      result.id = value
      result.handler = `<@${value}>`
      break

    case 'profile':
      result.email = value.email
      result.phone = value.phone || ''
      result.title = value.title || ''
      result.skype = value.skype || ''
      result.firstName = value.first_name
      result.lastName = value.last_name
      break

    case 'real_name':
      result.fullName = value
      break

    default:
      result[_.camelCase(key)] = value
      break
  }
  return result
}

export default function(user: any): IUser {
  return _.reduce(user, transformer, {})
}
