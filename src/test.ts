import * as _ from 'lodash'
import Dialog from './dialog'
import Command from './command'
import Consolebot from './bots/console'
import Slackbot from './bots/slack'

const developerParser = {
  parse: (message) => message == 'developer' ? 'DEvElOper' : false,
  check: (reply: string | boolean) => reply === 'DEvElOper'
}

class SampleDialog extends Dialog<Slackbot> {
  static isDefault = true

  async talk() {
    const {ask, message, parse} = this
    const parsed = await parse(message => message.toUpperCase())
    await ask('who are you? <% isDefault%>', reply => reply == 'boss' ? 'boss': null, 'you should be a boss, so who ae you?')
    console.log('>> ', parsed)
  }
}

const dialogs = []
const bot = new Consolebot({ dialogs: [SampleDialog] })
