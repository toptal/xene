import * as _ from 'lodash'
import Bot from './bot'
import Query from './queries/query'
import Performer from './performer'
import Scenario from './types/scenario'
import UserMessage from './types/messages/user'
import {PartialMessage} from './types/messages/bot'

import formatString from './helpers/format-string'
import strictifyMessage from './helpers/strictify-message'

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
  private performers: Map<string, Performer>

  constructor (public id: string, private bot: Bot) {}

  public async input (message: UserMessage) {
    const performer = this.getOrCreatePerformer(message)
    try {
      const done = await performer.input(message.text)
      if (done) { this.removePerformer(performer) }
    } catch (error) {
      // TODO do something with error
    }
  }

  public performByScenario (
    title: string,
    user: string | {[key: string]: string}
  ): Performer {
    const scenario = this.bot.getScenario(title)
    return this.setPerformer(scenario, user)
  }

  private getOrCreatePerformer(message: UserMessage): Performer {
    if (this.performers.has(message.user)) {
      return this.performers.get(message.user)
    }
    // either scenario based on user message or default
    const scenario = this.bot.matchScenario(message.text)
    return this.setPerformer(scenario, message.user)
  }

  private setPerformer (
    scenario: Scenario,
    user: string | {[key: string]: string}
  ): Performer {
    // TODO load users here
    const performer = new Performer(scenario, user)
    const users = _.isString(user) ? [user] : _.values(user)
    users.forEach(user => this.performers.set(user, performer))
    return performer
  }

  private removePerformer (performer: Performer) {
    this.performers.forEach((value, userId, performers) => {
      if (value !== performer) { return }
      performers.delete(userId)
    })
  }

  // private sendMessage (message: string | PartialMessage) {
  //   const botMessage = strictifyMessage(message, this.id)
  //   botMessage.text = formatString(botMessage.text, this.state),
  //   this.bot.sendMessage(botMessage)
  // }
}
