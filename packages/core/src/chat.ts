import { Bot as B } from './bot'
import { Dialog } from './dialog'
import * as Types from './types'

export class Chat<
  Bot extends B<any, Types.BaseUser>,
  User extends Types.BaseUser = Bot['_']['User'],
  UserMessage extends Types.UserMessage<User> = Types.UserMessage<User>
  > {

  private dialogs: Map<string, Dialog<Bot>> = new Map()

  constructor(public id: string, public bot: Bot) { }

  processMessage(message: UserMessage) {
    const dialog = this.dialogs.get(message.user.id)
    if (!dialog) return this.startFromMessage(message)
    this.forwardMessageToDialog(dialog, message.text)
  }

  startDialog(DialogClass: typeof Dialog, user: User, properties?: object) {
    const dialog = this.instantiateDialog(DialogClass, user, properties)
    dialog.onStart()
    this.runDialog(dialog)
    return dialog
  }

  async stopDialog(userId: string) {
    const dialog = this.dialogs.get(userId)
    if (!dialog) return
    dialog.onAbort()
    this.dialogs.delete(userId)
  }

  private startFromMessage({ user, text }: UserMessage) {
    const DialogClass = this.bot.matchDialog(text)
    if (!DialogClass) return
    const dialog = this.instantiateDialog(DialogClass, user)
    dialog.onStart()
    this.forwardMessageToDialog(dialog, text)
    this.runDialog(dialog)
  }

  private forwardMessageToDialog(dialog: Dialog<Bot>, message: string) {
    dialog.onIncomingMessage(message)
    dialog.queue.processMessage(message)
  }

  private runDialog(dialog: Dialog<Bot>) {
    dialog.talk()
      .then(() => dialog.onEnd())
      .catch(error => dialog.onAbort(error))
      .then(this.removeDialog.bind(this, dialog))
  }

  private instantiateDialog(DialogClass: typeof Dialog, user: User, properties: object = {}) {
    const dialog = new DialogClass(this.bot, this.id)
    this.dialogs.set(user.id, dialog)
    Object.assign(dialog, { user, ...properties })
    return dialog
  }

  private removeDialog(dialog: Dialog<Bot>) {
    this.dialogs.forEach((value, user, dialogs) => {
      if (value === dialog) dialogs.delete(user)
    })
  }
}
