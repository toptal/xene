import * as _ from 'lodash'
import * as assert from 'assert'

import SelfEmitter from './helpers/self-emitter'

import Chat from './chat'
import Dialog from './dialog'

import Adapter from './types/adapter'
import Command from './types/command'
import { default as User, SearchUser } from './types/user'

import { default as UserMessage } from './types/messages/user'
import { default as BotMessage, Attachment } from './types/messages/bot'

export type BotOptions = {
  adapter: Adapter
  commands?: Command[]
  dialogs: (typeof Dialog)[]
}

export default class Bot extends SelfEmitter {
  adapter: Adapter

  private chats: Map<string, Chat> = new Map()
  private declarations: { dialogs: (typeof Dialog)[], commands: Command[] }

  constructor({adapter, dialogs, commands}: BotOptions) {
    super()
    this.adapter = adapter
    this.declarations = { dialogs, commands: commands || [] }
    this.adapter.on('message', this.processUserMessage.bind(this))
  }

  private async processUserMessage(message: UserMessage) {
    const chat = await this.chat(message.chat)
    const isCommand = this.isCommand(message.text)
    chat.message(message)
  }

  private chat(id: string): Chat {
    if (this.chats.has(id)) return this.chats.get(id)
    const chat = new Chat(id, this)
    this.chats.set(id, chat)
    return chat
  }

  private defaultDialog(): typeof Dialog {
    const {dialogs} = this.declarations
    return _.find(dialogs, ['isDefault', true])
  }

  private isCommand(message: string): boolean {
    return _.some(this.declarations.commands, c => c.matcher(message))
  }

  resetChat(id: string) {
    this.chats.delete(id)
  }

  dialog(message: string): typeof Dialog {
    const predicate = d => d.match && d.match(message)
    return this.declarations.dialogs.find(predicate) || this.defaultDialog()
  }

  command(message: string): Command {
    // TODO fix command matcher
    return this.declarations.commands.find(c => c.matcher(message))
  }

  user(term: string | { handler?: string, email?: string }) {
    return this.adapter.user(term)
  }

  send(chat: string, message: string | BotMessage) {
    if (_.isString(message)) message = { text: message, attachments: [] }
    return this.adapter.send(chat, message)
  }
}
