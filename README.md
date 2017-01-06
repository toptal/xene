![xene](http://i.imgur.com/gMUjfBS.png)

Xene is a framework for building conversational bots either with TypeScript or modern JavaScript. From simple command based bots to rich natural language bots the framework provides all of the features needed to manage the conversational aspects of a bot. You can easily connect bots built using the framework to your users wherever they converse, from Slack to site to a terminal.

## Docs
For docs check `docs/` folder. For fast example, check [Create your first bot](#create-your-first-bot)

## Installation

To install `xene` just run `npm i --save xene` or `yarn add xene`.

__NOTE: `xene` is written in TypeScript and npm package already includes all typings.__

## Create your first bot

Let's create a simple bot, that will reply to our messages right in our terminal:

_NOTE: for all available types of bots check [bots doc](docs/bots.md)_

```ts
import Consolebot from 'xene/bots/console'
const bot = new Consolebot({})
```

Here we just created the silent bot, because if you try now to chat with him, he wouldn't reply. Let's add [dialogs](docs/dialogs.md) now.

```ts
import Dialog from 'xene/dialog'
import Consolebot from 'xene/bots/console'

function yesOrNoParser(message: string) {
  return /yes/i.test(message) ? 'yes' : 'no'
}

class Time extends Dialog<Consolebot> {
  time = new Date()
  static match(message: string) {
    return /(how\s+?much\s+?time)/i.test(message)
  }

  async talk() {
    const {message, ask} = this
    await message("Let's see!")
    const reply = await ask('You want me to say it in milliseconds?', yesOrNoParser)
    if (reply === 'yes') {
      return message('Time is ${time.getMilliseconds()}')
    } else {
      return message('Time is ${time.getSeconds()}')
    }
  }
}

const bot = new Consolebot({ dialogs: [Time] })
```

This is it, we just created our first annoying bot
