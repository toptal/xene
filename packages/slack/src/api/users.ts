import { APIModule } from './base'
import { User } from '../types'
import { get } from '../helpers/get'

import { App } from '@slack/bolt';
import { camelCase, isArray, transform, isObject } from "lodash"

export class Users extends APIModule {
  info = (user: string) =>
    this.request('info', { user }).then(get<User>('user'))

  list = () =>
    this.request('list').then(get<User[]>('members'))

  lookupByEmail = (email: string) =>
    this.request('lookupByEmail', { email }).then(get<User>('user'))
}

export class UsersBolt {
  app: App

  constructor(app: any) {
    this.app = app
  }

  info = async (user: string) => {
    const result = await this.app.client.users.info({ user })
    return camelize(result.user as User)
  }

  lookupByEmail = async (email: string) => {
    const result = await this.app.client.users.lookupByEmail({ email })

    return camelize(result.user as User)
  }
}

// Slack in Bolt uses snake_case for its API responses, so we need to camelize them
// Credits go to https://stackoverflow.com/questions/59769649/recursively-convert-an-object-fields-from-snake-case-to-camelcase/59771233#comment123909399_59771233
const camelize = (obj: User) => transform(obj, (result: User, value: unknown, key: string, target) => {
  const camelKey = isArray(target) ? key : camelCase(key)
  result[camelKey] = isObject(value) ? camelize(value as User) : value
})
