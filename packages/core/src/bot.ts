import Chat from './chat'
import Dialog from './dialog'
import Command from './command'

import IUserMessage from './types/user-message'

abstract class Bot<Message, User extends { id: string }> {
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
    delete this.IMessage
    delete this.IUser
  }

  async onMessage(message: IUserMessage): Promise<void> {
    const chat = await this.getChat(message.chat)
    const isCommand = this.isCommand(message.text)
    if (!isCommand) return chat.processMessage(message)
    const CommandClass = this.matchCommand(message.text)
    const user = await this.getUser(message.user)
    const command = new CommandClass(this, message.chat)
    command.user = user
    command.perform()
  }

  matchDialog(message: string): typeof Dialog {
    const dialogs = this.dialogs
    const isDefault = d => d.isDefault === true
    const predicate = d => d.match && d.match(message)
    return dialogs.find(predicate) || dialogs.find(isDefault)
  }

  matchCommand(message: string): typeof Command {
    return this.commands.find(c => c.match(message))
  }

  startDialog(DialogClass: typeof Dialog, chat: string, user: string, options: { [key: string]: any } = {}) {
    this.getChat(chat).startDialog(DialogClass, user, options)
  }

  stopDialog(chat: string, user: string) {
    this.getChat(chat).stopDialog(user)
  }

  abstract getUser(id: string): Promise<User>
  abstract sendMessage(chat: string, message: Message): Promise<any>
  abstract formatMessage(message: Message, object: any): Message

  private getChat(id: string): Chat {
    if (this.chats.has(id)) return this.chats.get(id)
    const chat = new Chat(id, this)
    this.chats.set(id, chat)
    return chat
  }

  private isCommand(message: string): boolean {
    return this.commands.some(c => c.match(message))
  }
}
export default Bot
