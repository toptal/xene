import { isString, find, some } from 'lodash'

import Chat from './ext/chat'
import Dialog from './dialog'
import Command from './command'

import IAdapter from './adapters/interface'
import IUserMessage from './types/user-message'
import { IAttachment } from './types/bot-message'

import { Console, Slack } from './adapters'

export default class Bot<T extends IAdapter> {
  adapter: T
  private chats: Map<string, Chat> = new Map()
  private dialogs: (typeof Dialog)[] = []
  private commands: (typeof Command)[] = []

  constructor({adapter, dialogs, commands}: {
    adapter: T, dialogs: (typeof Dialog)[], commands?: (typeof Command)[]
  }) {
    if (dialogs) this.dialogs = dialogs
    if (commands) this.commands = commands
    this.adapter = adapter
  }

  async onMessage(message: IUserMessage) {
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

  private isCommand(message: string): boolean {
    return some(this.commands, c => c.match(message))
  }

  resetChat(id: string) {
    this.chats.delete(id)
  }

  dialog(message: string): typeof Dialog {
    const dialogs = this.dialogs
    const predicate = d => d.match && d.match(message)
    return dialogs.find(predicate) || find(dialogs, ['isDefault', true])
  }

  command(message: string): typeof Command {
    return this.commands.find(c => c.match(message))
  }

  send(chat: string, message: string | { text: string, attachments: IAttachment[] }) {
    if (isString(message)) message = { text: message, attachments: [] }
    return this.adapter.send(chat, message)
  }
}
