import * as _ from 'lodash'
import * as uuid from 'node-uuid'
import Chat from './chat'

import Adapter from './types/adapter'
<<<<<<< 298ee47f9ba259d9e59842878c8e06f1d9d41ca5
import { default as User, SearchUser } from './types/user'
=======
import Command from './types/command'
import Scenario from './types/scenario'
>>>>>>> WIP
import { default as BotMessage } from './types/messages/bot'
import { default as UserMessage } from './types/messages/user'

import SelfEmitter from './helpers/self-emitter'
import formatString from './helpers/format-string'
import strictifyMessage from './helpers/strictify-message'

export type BotOptions = {
  adapter: Adapter
  commands?: Command[]
  scenarios: Scenario[]
}

const handler = {
  get (target, key) {
    if (key in target) { return target[key]}

    return 'some'
  }
}

function searchable (some: any[]) {
  return new Proxy<Array<any>>(some, handler)
}


export default class Bot extends SelfEmitter {
  public id: string
  public adapter: Adapter
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
    this.pipeAdapter()
  }

  private pipeAdapter () {
    const originalEmit = this.adapter.emit
    this.adapter.emit = (event, ...args): boolean => {
      originalEmit.apply(this.adapter, [event, ...args])
      return this.emit(event, ...args)
    }
  }

  @SelfEmitter.on('message')
  private async userInput (message: UserMessage) {
    this.emit('message.get', message)
    const chat = await this.chat(message.chat, message.type)
    return await chat.input(message)
  }

  public async chat (nameOrId: string, type: string): Promise<Chat> {
    const id = await this.adapter.getChat(nameOrId, type)
    if (this.chats.has(id)) { return this.chats.get(id) }
    const chat = new Chat(id, this)
    this.chats.set(id, chat)
    return chat
  }

  public getScenario (title: string): Scenario {
    const {scenarios} = this.declarations
    return _.find(scenarios, ['title', title])
  }

  public matchScenario (message: string): Scenario {
    const defaultScenario = this.getScenario('default')
    const predicate = t => t.matcher && t.matcher(message)
    return this.declarations.scenarios.find(predicate) || defaultScenario
  }

  public resetChat (id: string) {
    this.chats.delete(id)
  }

  private isCommand (message: string): boolean {
    return _.some(this.declarations.commands, c => c.matcher(message))
  }

  private macthCommand (message: string): Command {
    return _.find<Command>(this.declarations.commands, c => c.matcher(message))
  }

  private formatMessage (message: BotMessage): BotMessage {
    const chat = this.chats.get(message.chat)
    if (!chat) { return message }
    const user = this.adapter.getUser(chat.user)
    message.text = formatString(message.text, { user })
    return message
  }

  public user (idOrKeys: string | SearchUser): User {
    return this.adapter.findUser(idOrKeys)
  }

  public sendMessage (message: BotMessage) {
    this.emit('message.send', message)
    const attachments = message.attachments
    if (attachments) {
      message.attachments = attachments.map(attachmant => {
        attachmant.callbackId = this.id
        return attachmant
      })
    }
    const formatted = this.formatMessage(message)
    this.adapter.sendMessage(formatted)
  }
}
