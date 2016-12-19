import * as _ from 'lodash'
import Bot from './bot'
import Dialog from './dialog'
import Console from './adapters/console'
import Slack from './adapters/slack'
class X extends Bot<Slack> {

}

const developerParser = {
  parse: (message) => message == 'developer' ? 'DEvElOper' : false,
  check: (reply: string | boolean) => reply === 'DEvElOper'
}

class SampleDialog extends Dialog {
  static isDefault = true
  constructor(user: string, public bot: Bot<Slack>, chat: string) {
    super(user, bot, chat)
    this.bot.adapter.user
  }

  async talk() {
    const {ask, message, parse} = this
    await message('hi')
    const parsed = await parse(message => message.toUpperCase())
    await ask('who are you?', reply => reply == 'boss' ? 'boss': null, 'you should be a boss, so who ae you?')
    console.log('>> ', parsed)
  }
}

const dialogs = []
const adapter = new Console()
const bot = new X({ adapter, dialogs: [SampleDialog] })
