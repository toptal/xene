import { isString, find, some } from 'lodash'

import Chat from './chat'
import Dialog from '../dialog'
import Command from '../command'

import IUserMessage from './types/user-message'

abstract class Bot<Message, User> {
  IUser: User
  IMessage: Message
  private chats: Map<string, Chat> = new Map()
  private dialogs: typeof Dialog[] = []
  private commands: typeof Command[] = []

  constructor({dialogs, commands}: {
    dialogs: typeof Dialog[], commands?: typeof Command[]
  }) {
    if (dialogs) this.dialogs = dialogs
    if (commands) this.commands = commands

    // This is a workaround to bind interfaces of User and Message
    // to Bot class so we can use them in other dependent classes
    // with typesafty, but we don't need them in runtime
    // delete this.IMessage
    // delete this.IUser
  }

  async onMessage(message: IUserMessage): Promise<void> {
    const chat = await this.chat(message.chat)
    const isCommand = this.isCommand(message.text)
    if (!isCommand) return chat.message(message)
    const CommandClass = this.matchCommand(message.text)
    const command = new CommandClass(message.chat, this, message.user)
    command.do()
  }

  matchDialog(message: string): typeof Dialog {
    const dialogs = this.dialogs
    const predicate = d => d.match && d.match(message)
    return dialogs.find(predicate) || find(dialogs, ['isDefault', true])
  }

  matchCommand(message: string): typeof Command {
    return this.commands.find(c => c.match(message))
  }

  abstract sendMessage(chat: string, message: Message): Promise<any>
  abstract formatMessage(message: Message, object: any): Message
  abstract getUser(idOrFilter: string | Partial<User>): Promise<User>
  abstract getUsers(filter: Partial<User>): Promise<User[]>

  private chat(id: string): Chat {
    if (this.chats.has(id)) return this.chats.get(id)
    const chat = new Chat(id, this)
    this.chats.set(id, chat)
    return chat
  }

  private isCommand(message: string): boolean {
    return some(this.commands, c => c.match(message))
  }
}
export default Bot
