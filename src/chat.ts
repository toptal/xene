import * as _ from 'lodash'
import Bot from './bot'
import Topic from './types/topic'
import Query from './queries/query'
import {PartialMessage} from './types/messages/bot'

import formatString from './helpers/format-string'
import strictifyMessage from './helpers/strictify-message'

export default class Chat {
  private query: Query
  private state: Object = {}
  private queries: Query[]

  constructor (public id: string, public user:string, private bot: Bot) { }

  public setTopic (topic: Topic) {
    const resolvedQueries = topic.queries.map(q => q())
    this.queries = resolvedQueries
    this.query = _.head(resolvedQueries)
  }

  public async handleMessage (messageText: string): Promise<{done: boolean, next?: string, error?: any}> {
    try {
      var result = await this.query.handle(this.state, this.bot, messageText)
    } catch (e) {
      return this.error(e)
    }

    if (result.message) {
      this.sendMessage(result.message)
    }

    const {exit, done, nextTopic} = result
    if (exit || !done) {
      return { done: exit, next: (exit ? nextTopic : null) }
    }

    this.nextQuery(result.nextStep)

    const {storeAs, value} = result
    if (storeAs && value) {
      this.state[storeAs] = value
    }
    return await this.handleMessage(messageText)
  }

  private error (e) {
    console.error(e)
    return { error: e, done: true, next: null }
  }

  private nextQuery (key) {
    let nextIndex = this.queries.indexOf(this.query) + 1
    nextIndex = key ? _.findIndex(this.queries, ['step', key]) : nextIndex
    this.query = this.queries[nextIndex]
  }

  private sendMessage (message: string | PartialMessage) {
    const botMessage = strictifyMessage(message, this.id)
    botMessage.text = formatString(botMessage.text, this.state),
    this.bot.sendMessage(botMessage)
  }
}
