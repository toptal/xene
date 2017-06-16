import Bot from './bot'
import Dialog from './dialog'
import { BaseUser } from './types'

export default class Chat<B extends Bot<any, BaseUser>> {
  private dialogs: Map<string, Dialog<B>> = new Map()

  constructor(public id: string, public bot: B) { }

  processMessage(message: B['_']['UserMessage']) {
    const dialog = this.dialogs.get(message.user.id)
    if (!dialog) return this.startFromMessage(message)
    this.forwardMessageToDialog(dialog, message.text)
  }

  startDialog(
    DialogClass: typeof Dialog,
    user: B['_']['User'],
    options: { [key: string]: any } = {}
  ): Dialog<B> {
    const dialog = this.instantiateDialog(DialogClass, user, options)
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

  private startFromMessage({ user, text }: B['_']['UserMessage']) {
    const DialogClass = this.bot.matchDialog(text)
    if (!DialogClass) return
    const dialog = this.instantiateDialog(DialogClass, user)
    dialog.onStart()
    this.forwardMessageToDialog(dialog, text)
    this.runDialog(dialog)
  }

  private forwardMessageToDialog(dialog: Dialog<B>, message: string) {
    dialog.onIncomingMessage(message)
    dialog.queue.processMessage(message)
  }

  private runDialog(dialog: Dialog<B>) {
    dialog.talk()
      .then(() => dialog.onEnd())
      .catch(error => dialog.onAbort(error))
      .then(this.removeDialog.bind(this, dialog))
  }

  private instantiateDialog(
    DialogClass: typeof Dialog,
    user: B['_']['User'],
    options: { [key: string]: any } = {}
  ) {
    const dialog = new DialogClass(this.bot, this.id)
    this.dialogs.set(user.id, dialog)
    Object.assign(dialog, { user, ...options })
    return dialog
  }

  private removeDialog(dialog: Dialog<B>) {
    this.dialogs.forEach((value, user, dialogs) => {
      if (value === dialog) dialogs.delete(user)
    })
  }
}
