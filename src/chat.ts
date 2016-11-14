import * as _ from 'lodash'
import Bot from './bot'
import User from './types/user'
import Topic from './types/topic'
import Query from './queries/query'
import {default as Message, PartialMessage} from './types/messages/bot'

import formatString from './helpers/format-string'
import strictifyMessage from './helpers/strictify-message'

/*
Chat is a representation of channels or groups or even
direct messages. Chats can hold more then one thread
with multiple users in the Chat. Also Chat probides an API
to add, or remove people from Chat or even destroy Chat
if bot has enough ability to do so.
*/
export default class Chat {
  private query: Query
  private state: Object = {}
  private queries: Query[]

  constructor (public id: string, private bot: Bot) { }

  public setTopic (topic: Topic) {
    const resolvedQueries = topic.queries.map(q => q())
    this.queries = resolvedQueries
    this.query = _.head(resolvedQueries)
  }

  public async newMessage (message: Message) {

    return await this.newMessage(message)
  }

  public thread (name: string, user: User | {[name: string]: User}) {
    const users =
  }

  private sendMessage (message: string | Message, PartialMessage) {
    const botMessage = strictifyMessage(message, this.id)
    botMessage.text = formatString(botMessage.text, this.state),
    this.bot.sendMessage(botMessage)
  }
}
