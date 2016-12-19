import Bot from '../bot'
import Dialog from '../dialog'
import Message from '../types/user-message'

export default class Chat {
  private dialogs: Map<string, Dialog> = new Map()

  constructor(public id: string, public bot: Bot) { }

  async message(message: Message) {
    const dialog = await this.dialogByMessage(message)
    if (dialog) dialog.queue.input(message.text)
  }

  private async dialogByMessage({user, text}: Message): Promise<Dialog> {
    if (this.dialogs.has(user)) return this.dialogs.get(user)
    const DialogClass = this.bot.dialog(text)
    if (DialogClass) return this.initDialog(DialogClass, user)
  }

  private initDialog(DialogClass: typeof Dialog, userId: string): Dialog {
    const dialog = new DialogClass(this.id, this.bot, userId)
    this.dialogs.set(userId, dialog)
    dialog.talk().then(this.removeDialog.bind(this, dialog))
    return dialog
  }

  private removeDialog(dialog: Dialog) {
    this.dialogs.forEach((value, userId, dialogs) => {
      if (value == dialog) dialogs.delete(userId)
    })
  }
}
