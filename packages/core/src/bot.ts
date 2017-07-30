import { Chat } from './chat'
import { UserMessage, BaseUser, DialogFactory, CommandFactory } from './types'

export abstract class Bot<
  Message extends any = any,
  User extends BaseUser = BaseUser
  > {
  // This is a workaround to bind interfaces of User and Message
  // to Bot class so we can use them in other dependent classes
  // with typesafty, but we don't need them in runtime
  _: {
    User: User
    Message: Message
    UserMessage: UserMessage<User>
  }

  private chats: Map<string, Chat> = new Map()
  private dialogs: DialogFactory<Bot>[] = []
  private commands: CommandFactory<Bot>[] = []

  constructor({ dialogs, commands }: {
    dialogs: DialogFactory<Bot>[], commands?: CommandFactory<Bot>[]
  }) {
    if (dialogs) this.dialogs = dialogs
    if (commands) this.commands = commands
  }

  onMessage(message: UserMessage<User>): void {
    const chat = this.getChat(message.chat)
    const isCommand = this.isCommand(message.text)
    if (!isCommand) return chat.processMessage(message)
    const CommandClass = this.matchCommand(message.text)
    const command = new CommandClass(this, message.chat)
    command.user = message.user
    command.perform()
  }

  matchDialog(message: string): DialogFactory<Bot> {
    const dialogs = this.dialogs
    const isDefault = d => d.isDefault === true
    const predicate = d => d.match && d.match(message)
    return dialogs.find(predicate) || dialogs.find(isDefault)
  }

  matchCommand(message: string): CommandFactory<Bot> {
    return this.commands.find(c => c.match(message))
  }

  startDialog(options: { dialog: DialogFactory<Bot>, chat: string, user: User, properties?: object }) {
    this.getChat(options.chat).startDialog(options.dialog, options.user, options.properties)
  }

  stopDialog(chat: string, user: User) {
    this.getChat(chat).stopDialog(user.id)
  }

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
