<div align="center"><img src="http://imgur.com/YgPmLct.png" width="445"/></div>

<div align="center">
  <a href="https://travis-ci.org/dempfi/xene">
    <img src="https://travis-ci.org/dempfi/xene.svg?branch=master" />
  </a>
</div>

```js
import { Slackbot } from '@xene/slack'

new Slackbot({ botToken: 'xxx-token' })
  // Match with regular expression and just reply
  .when(/hi|hey|hello/i).say('Hi there!')

  // Match exact string and execute some function
  .when('stop it').do((msg, bot) => bot.abortDialog(msg.chat, msg.user))

  // Match with function and start new dialog with user
  .when(msg => msg.text === 'I want pizza!').talk(async (dialog, bot) => {
    const user = await bot.users.info(dialog.user)
    // Await for user to reply to a question and parse their reply
    const withPepperoni = await dialog.ask('With pepperoni?', (msg) => msg === 'yes')
    placePizzaOrder(dialog.user, { pepperoni: withPepperoni })
    await dialog.say(`Ok, ${user.profile.firstName}, you pizza is on its way. `)
  })
```

Xene is a framework for building conversational bots either with modern JavaScript. From simple command based bots to rich natural language bots the framework provides all of the features needed to manage the conversational aspects of a bot.

### Packages
Xene is split into different packages and depending on with which service your bot should work you should install appropriate package.
<table align="center">
  <tr>
    <td><strong>Core</strong></td>
    <td><code>npm i @xene/core</code></td>
    <td>Core of each bots xene provides. Because of this library all they have same simple API for conversations.</td>
  </tr>
  <tr>
    <td><a href="https://slack.com">Slack</a></td>
    <td><code>npm i @xene/slack</code></td>
    <td>Interface for Slack bot with additions for interactive message handling.</td>
  </tr>
  <tr>
    <td><a href="https://telegram.org">Telegram</a></td>
    <td><code>npm i @xene/telegram</code></td>
    <td><em>In progress</em></td>
  </tr>
  <tr>
    <td><strong>Test</strong></td>
    <td><code>npm i @xene/test</code></td>
    <td>Interface to test your bot. Like supertest for koa/express.</td>
  </tr>
</table>

### TypeScript
`xene` is written in TypeScript and npm package already includes all typings.

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
