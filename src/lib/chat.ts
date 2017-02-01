import Bot from './bot'
import Dialog from '../dialog'
import IUserMessage from './types/user-message'

type BoundDialog = Dialog<Bot<any, any>>

export default class Chat {
  private dialogs: Map<string, BoundDialog> = new Map()

  constructor(public id: string, public bot: Bot<any, any>) { }

  async processMessage(message: IUserMessage) {
    const dialog = await this.dialogs.get(message.user)
    if (!dialog) return this.startFromMessage(message)
    this.forwardMessageToDialog(dialog, message.text)
  }

  async startDialog(
    DialogClass: typeof Dialog,
    userId: string,
    options: {[key: string]: any} = {}
  ): Promise<Dialog<Bot<any, any>>> {
    const dialog = await this.instantiateDialog(DialogClass, userId, options)
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

  private async startFromMessage({user, text}: IUserMessage) {
    const DialogClass = this.bot.matchDialog(text)
    if (!DialogClass) return
    const dialog = await this.instantiateDialog(DialogClass, user)
    dialog.onStart()
    this.forwardMessageToDialog(dialog, text)
    this.runDialog(dialog)
  }

  private forwardMessageToDialog(dialog: BoundDialog, message: string) {
    dialog.onIncomingMessage(message)
    dialog.queue.processMessage(message)
  }

  private runDialog(dialog: BoundDialog) {
    dialog.talk()
      .then(() => dialog.onEnd())
      .then(this.removeDialog.bind(this, dialog))
  }

  private async instantiateDialog(
    DialogClass: typeof Dialog,
    userId: string,
    options: { [key: string]: any } = {}
  ) {
    const dialog = new DialogClass(this.bot, this.id)
    this.dialogs.set(userId, dialog)
    const user = await this.bot.getUser(userId)
    Object.assign(dialog, { user, ...options })
    return dialog
  }

  private removeDialog(dialog: BoundDialog) {
    this.dialogs.forEach((value, user, dialogs) => {
      if (value === dialog) dialogs.delete(user)
    })
  }
}
