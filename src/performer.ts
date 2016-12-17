import * as _ from 'lodash'
import Chat from './chat'
import Query from './queries/query'
import Scenario from './types/scenario'
import {PartialMessage} from './types/messages/bot'
import {default as User, UserOption} from './types/user'

import formatString from './helpers/format-message'
import formatMessage from './helpers/format-message'

class QueryError extends Error {}

export default class Performer {
  public user: User
  public users: {[key: string]: User}
  public scenario: string

  private state: Object = {}
  private query: Query
  private queries: Query[]

  constructor (scenario: Scenario, {user, users}: UserOption, private chat: Chat) {
    this.user = user
    this.users = users
    this.setScenario(scenario)
  }

  public async input (text?: string): Promise<boolean>  {
    let result
    try {
      result = await this.query.handle(this.state, this.chat.bot, text)
    } catch (error) {
      // if something gone wrong inside of user defined query
      // it's better to return control to user
      throw new QueryError(error)
    }

    await this.trySendMessage(result.message)

    if (!result.done) return false

    if (!result.exit) this.setNextQuery(result.nextStep)
    this.trySaveState(result.storeAs, result.value)

    if (result.exit && !result.nextTopic) return true
    this.tryReplaceScenario(result.nextTopic)

    return await this.input(text)
  }

  setState (k: string, v: any) {
    this.state[k] = v
  }

  private setScenario (scenario: Scenario) {
    this.scenario = scenario.title
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

  private async trySendMessage (partialMessage: string | PartialMessage) {
    if (!partialMessage) return
    const formatOptions = _.cloneDeep<any>(this.state)
    if (this.user) formatOptions.user = this.user
    if (this.users) formatOptions.users = this.users
    const message = formatMessage(partialMessage, formatOptions)
    const resp = await this.chat.send(message)
    this.chat.bot.emit('message.send', {
      id: resp.ts,
      chat: this.chat.id,
      scenario: this.scenario,
      attachments: message.attachments,
      text: message.text,
      users: this.users,
      user: this.user
    })
  }
}
