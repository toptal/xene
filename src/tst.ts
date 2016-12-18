import * as _ from 'lodash'
import Bot from './bot'
import Dialog from './dialog'
import Console from './adapters/console'

const developerParser = {
  parse: (message) => message == 'developer' ? 'DEvElOper' : false,
  check: (reply: string | boolean) => reply === 'DEvElOper'
}

class SampleDialog extends Dialog {
  static isDefault = true
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
const bot = new Bot({ adapter, dialogs: [SampleDialog] })
