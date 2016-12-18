import * as _ from 'lodash'
import * as assert from 'assert'

import Chat from './ext/chat'
import Dialog from './dialog'
import Command from './command'

import Adapter from './types/adapter'
import { default as User, SearchUser } from './types/user'

import { default as UserMessage } from './types/messages/user'
import { default as BotMessage, Attachment } from './types/messages/bot'

export type BotOptions = {
  adapter: Adapter
  dialogs: (typeof Dialog)[]
  commands?: (typeof Command)[]
}

export default class Bot {
  adapter: Adapter

  private chats: Map<string, Chat> = new Map()
  private dialogs: (typeof Dialog)[] = []
  private commands: (typeof Command)[] = []

  constructor({adapter, dialogs, commands}: BotOptions) {
    this.adapter = adapter
    if (dialogs) this.dialogs = dialogs
    if (commands) this.commands = commands
    this.adapter.on('message', this.processUserMessage.bind(this))
  }

  private async processUserMessage(message: UserMessage) {
    const chat = await this.chat(message.chat)
    const isCommand = this.isCommand(message.text)
    if (!isCommand) return chat.message(message)
    const CommandClass = this.command(message.text)
    const command = new Command(message.chat, this, message.user)
    command.do()
  }

  private chat(id: string): Chat {
    if (this.chats.has(id)) return this.chats.get(id)
    const chat = new Chat(id, this)
    this.chats.set(id, chat)
    return chat
  }

  private defaultDialog(): typeof Dialog {
    return _.find(this.dialogs, ['isDefault', true])
  }

  private isCommand(message: string): boolean {
    return _.some(this.commands, c => c.match(message))
  }

  resetChat(id: string) {
    this.chats.delete(id)
  }

  dialog(message: string): typeof Dialog {
    const predicate = d => d.match && d.match(message)
    return this.dialogs.find(predicate) || this.defaultDialog()
  }

  command(message: string): typeof Command {
    return this.commands.find(c => c.match(message))
  }

  user(term: string | { handler?: string, email?: string }) {
    return this.adapter.user(term)
  }

  send(chat: string, message: string | BotMessage) {
    if (_.isString(message)) message = { text: message, attachments: [] }
    return this.adapter.send(chat, message)
  }
}
