import Bot from './bot'
import Dialog from '../dialog'
import IUserMessage from './types/user-message'

type BoundDialog = Dialog<Bot<any, any>>

export default class Chat {
  private dialogs: Map<string, BoundDialog> = new Map()

  constructor(public id: string, public bot: Bot<any, any>) { }

  async processMessage(message: IUserMessage) {
    const dialog = await this.dialogByMessage(message)
    if (dialog) dialog.queue.processMessage(message.text)
  }

  async startDialog(
    DialogClass: typeof Dialog,
    userId: string,
    options: {[key: string]: any} = {}
  ): Promise<Dialog<Bot<any, any>>> {
    const dialog = new DialogClass(this.bot, this.id)
    this.dialogs.set(userId, dialog)
    const user = await this.bot.getUser(userId)
    Object.assign(dialog, {user, ...options})
    dialog.talk().then(this.removeDialog.bind(this, dialog))
    return dialog
  }

  private async dialogByMessage({user, text}: IUserMessage): Promise<BoundDialog> {
    if (this.dialogs.has(user)) return this.dialogs.get(user)
    const DialogClass = this.bot.matchDialog(text)
    if (DialogClass) return this.startDialog(DialogClass, user)
  }

  private removeDialog(dialog: BoundDialog) {
    this.dialogs.forEach((value, user, dialogs) => {
      if (value === dialog) dialogs.delete(user)
    })
  }
}
