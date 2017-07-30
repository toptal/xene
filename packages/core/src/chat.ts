import { Bot } from './bot'
import { Dialog } from './dialog'
import { UserMessage, BaseUser, DialogFactory } from './types'

export class Chat {

  private dialogs: Map<string, Dialog<Bot>> = new Map()

  constructor(public id: string, public bot: Bot) { }

  processMessage(message: UserMessage<BaseUser>) {
    const dialog = this.dialogs.get(message.user.id)
    if (!dialog) return this.startFromMessage(message)
    this.forwardMessageToDialog(dialog, message.text)
  }

  startDialog(DialogClass: DialogFactory<Bot>, user: BaseUser, properties?: object) {
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

  private startFromMessage({ user, text }: UserMessage<BaseUser>) {
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

  private instantiateDialog(DialogClass: DialogFactory<Bot>, user: BaseUser, properties: object = {}) {
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
