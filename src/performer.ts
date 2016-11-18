import * as _ from 'lodash'
import Chat from './chat'
import User from './types/user'
import Query from './queries/query'
import Scenario from './types/scenario'
import {PartialMessage} from './types/messages/bot'

import formatString from './helpers/format-message'
import formatMessage from './helpers/format-message'

class QueryError extends Error {}

export default class Performer {
  private user: User
  private users: {[key: string]: User}
  private state: Object = {}
  private query: Query
  private queries: Query[]

  constructor (
    scenario: Scenario,
    user: string | {[name: string]: string},
    private chat: Chat
  ) {
    this.setScenario(scenario)
    this.loadUsers(user)
  }

  public async input (text: string): Promise<boolean>  {
    let result
    try {
      result = await this.query.handle(this.state, this.chat.bot, text)
    } catch (error) {
      // if something gone wrong inside of user defined query
      // it's better to return control to user
      throw new QueryError(error)
    }

    this.trySendMessage(result.message)
    this.tryReplaceScenario(result.nextTopic)

    if (result.exit || result.done) return true

    this.setNextQuery(result.nextStep)
    this.trySaveState(result.storeAs, result.value)
    return await this.input(text)
  }

  private setScenario (scenario: Scenario) {
    this.queries = scenario.queries.map(q => q())
    this.query = _.head(this.queries)
  }

  private tryReplaceScenario (scenarioTitle?: string) {
    if (!scenarioTitle) return
    const scenario = this.chat.bot.getScenario(scenarioTitle)
    this.setScenario(scenario)
  }

  private trySaveState(key?: string, value?: any) {
    if (!key || !value) return
    this.state[key] = value
  }

  private setNextQuery (key?: string) {
    let index = this.queries.indexOf(this.query) + 1
    if (key) index = _.findIndex(this.queries, ['step', key])
    this.query = this.queries[index]
  }

  private loadUsers (user: string | {[name: string]: string}) {
    if (!_.isString(user))
      this.users = _.mapValues(user, id => this.chat.bot.user(id))
    else
      this.user = this.chat.bot.user(user)
  }

  private trySendMessage (partialMessage: string | PartialMessage) {
    if (!partialMessage) return
    const formatOptions = _.cloneDeep<any>(this.state)
    if (this.user) formatOptions.user = this.user
    if (this.users) formatOptions.users = this.users
    const message = formatMessage(partialMessage, formatOptions)
    this.chat.send(message)
  }
}
