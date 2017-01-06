import * as _ from 'lodash'
import Dialog from './dialog'
import Command from './command'
import Consolebot from './bots/console'

const developerParser = {
  parse: (message) => message === 'developer' ? 'DEvElOper' : false,
  check: (reply: string | boolean) => reply === 'DEvElOper'
}

class SampleDialog extends Dialog<Consolebot> {
  static isDefault = true

  async talk() {
    const {ask, message, parse} = this
    const parsed = await parse(msg => msg.toUpperCase())
    await ask('who are you?', reply =>
      reply === 'boss' ? 'boss' : null, 'you should be a boss, so who ae you?'
    )
    message('Hi boss!')
  }
}

const dialogs = [SampleDialog]
const bot = new Consolebot({ dialogs })
