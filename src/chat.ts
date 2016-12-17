import * as _ from 'lodash'
import Bot from './bot'
import Dialog from './dialog'

import Message from './types/messages/bot'
import UserMessage from './types/messages/user'
import { default as User, UserOption } from './types/user'

import formatString from './helpers/format-string'
import formatMessage from './helpers/format-message'

/*
Chat is a representation of channels or groups or even
direct messages. Chat can hold more then one dialogs
with multiple users in the Chat.
*/
export default class Chat {
  private dialogs: Map<string, Dialog> = new Map()

  constructor(public id: string, public bot: Bot) { }

  async message(message: UserMessage) {
    const dialog = await this.dialogByMessage(message)
    dialog.queue.input(message.text)
  }

  private async dialogByMessage(message: UserMessage): Promise<Dialog> {
    if (this.dialogs.has(message.user))
      return this.dialogs.get(message.user)
    // either scenario based on user message or default
    const user = await this.bot.adapter.user(message.user)
    const Dialog = this.bot.dialog(message.text)
    return this.initDialog(Dialog, user)
  }

  initDialog(DialogClass: typeof Dialog, user: User): Dialog {
    const dialog = new DialogClass(this.id, this.bot, user)
    this.dialogs.set(user.id, dialog)
    dialog.talk().then(this.removeDialog.bind(this, dialog))
    return dialog
  }

  private removeDialog(dialog: Dialog) {
    this.dialogs.forEach((value, userId, dialogs) => {
      if (value == dialog) dialogs.delete(userId)
    })
  }
}
