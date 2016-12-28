import * as _ from 'lodash'
import Dialog from './dialog'
import ConsoleBot from './bots/console'

const developerParser = {
  parse: (message) => message == 'developer' ? 'DEvElOper' : false,
  check: (reply: string | boolean) => reply === 'DEvElOper'
}

class SampleDialog extends Dialog<ConsoleBot> {
  static isDefault = true

  async talk() {
    const {ask, message, parse} = this
    console.log('GFHJGFHFGJ')
    message()
    const parsed = await parse(message => message.toUpperCase())
    await ask('who are you? <% isDefault%>', reply => reply == 'boss' ? 'boss': null, 'you should be a boss, so who ae you?')
    console.log('>> ', parsed)
  }
}

const dialogs = []
const bot = new ConsoleBot({ dialogs: [SampleDialog] })
