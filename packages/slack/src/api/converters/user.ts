import * as _ from 'lodash'
import { camel } from './camel'
import { User } from '../../types'

function transformer(result, value, key): User {
  switch (key) {
    case 'id':
      result.id = value
      result.handle = `<@${value}>`
      break

    case 'real_name':
      result.fullName = value
      break

    case 'profile':
      result.profile = camel(value)
      break

    default:
      result[_.camelCase(key)] = value
      break
  }
  return result
}

export const user = (userObj: any): User =>
  _.reduce(userObj, transformer, {})
