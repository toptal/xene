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

  private async dialogByMessage({user, text}: IUserMessage): Promise<BoundDialog> {
    if (this.dialogs.has(user)) return this.dialogs.get(user)
    const DialogClass = this.bot.matchDialog(text)
    if (DialogClass) return this.initDialog(DialogClass, user)
  }

  private initDialog(DialogClass: typeof Dialog, userId: string): BoundDialog {
    const dialog = new DialogClass(this.id, this.bot, userId)
    this.dialogs.set(userId, dialog)
    dialog.talk().then(this.removeDialog.bind(this, dialog))
    return dialog
  }

  private removeDialog(dialog: BoundDialog) {
    this.dialogs.forEach((value, userId, dialogs) => {
      if (value === dialog) dialogs.delete(userId)
    })
  }
}
