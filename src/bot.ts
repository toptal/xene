import * as _ from 'lodash'
import * as assert from 'assert'

import * as uuid from 'node-uuid'
import SelfEmitter from './helpers/self-emitter'

import Chat from './chat'
import {Parse} from './queries/parse'

import Adapter from './types/adapter'
import Command from './types/command'
import Scenario from './types/scenario'
import { default as User, SearchUser } from './types/user'

import { default as UserMessage } from './types/messages/user'
import { default as BotMessage, Attachment } from './types/messages/bot'

export type BotOptions = {
  adapter: Adapter
  commands?: Command[]
  scenarios: Scenario[]
}

export default class Bot extends SelfEmitter {
  id: string
  adapter: Adapter
  private chats: Map<string, Chat> = new Map()
  private declarations: {
    scenarios: Scenario[],
    commands: Command[]
  }

  constructor ({adapter, scenarios, commands}: BotOptions, id?: string) {
    super()
    this.adapter = adapter
    this.id = id || uuid.v4()
    this.declarations = { scenarios, commands: commands || [] }
    this.propogateAdapterEvents()
  }

  private propogateAdapterEvents () {
    const originalEmit = this.adapter.emit
    this.adapter.emit = (event, ...args): boolean => {
      originalEmit.apply(this.adapter, [event, ...args])
      return this.emit(event, ...args)
    }
  }

  @SelfEmitter.on('message')
  private async userInput (message: UserMessage) {
    const chat = await this.chat(message.chat)
    const isCommand = this.isCommand(message.text)
    return await (isCommand ? chat.command(message) : chat.message(message))
  }

  private chat (id: string): Chat {
    if (this.chats.has(id)) return this.chats.get(id)
    const chat = new Chat(id, this)
    this.chats.set(id, chat)
    return chat
  }

  async perform (options: {
    chat: string, scenario: string, user?: User, users?: {[key:string]: User}
  }) {
    const {user, users} = options
    assert.ok(user && users, 'You can\'t specify both user and users params.')
    assert.ok(user || users, 'User or users param should be specified.')
    const chat = this.chat(options.chat)
    const scenario = this.getScenario(options.scenario)
    const firstQuery = _.head(scenario.queries)()
    assert.ok(firstQuery instanceof Parse, 'Scenario can\'t start with Parse query.')
    const performer = chat.setPerformer(scenario, { user, users })
    performer.input()
  }

  getScenario (title: string): Scenario {
    const {scenarios} = this.declarations
    return _.find(scenarios, ['title', title])
  }

  matchScenario (message: string): Scenario {
    const defaultScenario = this.getScenario('default')
    const predicate = t => t.matcher && t.matcher(message)
    return this.declarations.scenarios.find(predicate) || defaultScenario
  }

  resetChat (id: string) {
    this.chats.delete(id)
  }

  private isCommand (message: string): boolean {
    return _.some(this.declarations.commands, c => c.matcher(message))
  }

  macthCommand (message: string): Command {
    return _.find<Command>(this.declarations.commands, c => c.matcher(message))
  }

  send (chat: string, message: string | BotMessage) {
    if (_.isString(message)) message = {text: message, attachments: []}
    const predicate = a => _.set<Attachment>(a, 'callbackId', this.id)
    message.attachments = message.attachments.map(predicate)
    return this.adapter.send(chat, message)
  }
}
