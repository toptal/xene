import * as _ from 'lodash'
import Bot from './bot'
import Query from './queries/query'
import Performer from './performer'

import Message from './types/messages/bot'
import Scenario from './types/scenario'
import UserMessage from './types/messages/user'
import {default as User, UserOption} from './types/user'

import formatString from './helpers/format-string'
import formatMessage from './helpers/format-message'

/*
Chat is a representation of channels or groups or even
direct messages. Chat can hold more then one performers
with multiple users in the Chat. Also Chat probides an API
to add, or remove people from Chat or even destroy Chat
if bot has enough ability to do so.
*/
export default class Chat {

  /*
  NOTE we can store userless performers at key `common`
  and check it after check for specific performers for user
  but before we try to create new performer from message
  */
  private performers: Map<string, Performer> = new Map()

  constructor (public id: string, public bot: Bot) {}

  async message (message: UserMessage) {
    const performer = await this.performerByMessage(message)
    this.bot.emit('message.get', {
      scenario: performer.scenario,
      users: performer.users,
      user: performer.user,
      text: message.text,
      id: message.id,
      chat: this.id
    })
    try {
      const isDone = await performer.input(message.text)
      if (!isDone) return
      const {scenario, user, users} = performer
      this.bot.emit('scenario.finish', {
        chat: this.id,
        scenario,
        users,
        user
      })
      this.removePerformer(performer)
    } catch (e) { throw e }
  }

  async command (message: UserMessage) {
    const command = this.bot.macthCommand(message.text)
    const res = await command.action(this, message)
    if (res === false) return
    const user = await this.bot.adapter.user(message.user)
    this.send(formatMessage(command.message, {user}))
  }

  private async performerByMessage(message: UserMessage): Promise<Performer> {
    if (this.performers.has(message.user))
      return this.performers.get(message.user)
    // either scenario based on user message or default
    const user = await this.bot.adapter.user(message.user)
    const scenario = this.bot.matchScenario(message.text)
    return this.setPerformer(scenario, {user})
  }

  setPerformer (scenario: Scenario, userOption: UserOption): Performer {
    this.bot.emit('scenario.start', {
      scenario: scenario.title,
      users: userOption.users,
      user: userOption.user,
      chat: this.id
    })

    const performer = new Performer(scenario, userOption, this)
    const users = userOption.user ? [userOption.user] : _.values(userOption.users)
    users.forEach(user => this.performers.set(user.id, performer))
    return performer
  }

  stopPerformer (userId: string) {
    const performer = this.performers.get(userId)
    const deleted = this.performers.delete(userId)
    if (!deleted) return false
    const {scenario, user, users} = performer
    this.bot.emit('scenario.abort', {
      chat: this.id,
      scenario,
      users,
      user
    })
  }

  private removePerformer (performer: Performer) {
    this.performers.forEach((value, userId, performers) => {
      if (value == performer) performers.delete(userId)
    })
  }

  send (message: Message) {
    return this.bot.send(this.id, message)
  }
}
