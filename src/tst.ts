import * as _ from 'lodash'
import Bot from './bot'
import Dialog from './dialog'
import Console from './adapters/console'
class ConsoleBot extends Bot<Console> { }

const developerParser = {
  parse: (message) => message == 'developer' ? 'DEvElOper' : false,
  check: (reply: string | boolean) => reply === 'DEvElOper'
}

class SampleDialog extends Dialog<ConsoleBot> {
  static isDefault = true

  async talk() {
    console.log('GFHJGFHFGJ')
    const {ask, message, parse} = this
    const parsed = await parse(message => message.toUpperCase())
    await ask('who are you? <% isDefault%>', reply => reply == 'boss' ? 'boss': null, 'you should be a boss, so who ae you?')
    console.log('>> ', parsed)
  }
}

const dialogs = []
const bot = new ConsoleBot({ adapter: new Console(), dialogs: [SampleDialog] })
