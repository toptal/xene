---
id:       bot
prev:     command
category: reference

---

# Bot

<!--intro-->
Write your own bot.
<!--/intro-->

`Bot` class is a key part of xene, it manages user's messages, matches them with dialogs and defines constraints for third party bot authors. Its purpose is to wrap all xene related conversation logic in one place and provide simplest possible API to add support for new service, like [Slackbot](../../slack/docs/slackbot.md).

## How to create bot for service X

It's fairly easy. To create new bot you have to subclass `Bot`, override `sendMessage` and call `onMessage` when you receive a new message.

Let's create a simple bot that will communicate with users right in the console.

```ts
import { Bot } from '@xene/core'
import * as readline from 'readline'

class TermBot extends Bot {

  constructor(options) {
    super(options)
    const input = process.stdin
    const output = process.stdout
    this.rl = readline.createInterface({ input, output })
    this.rl.on('line', this.onMessage.bind(this))
  }

  onMessage(line) {
    const id = Date.now()
    const chat = process.cwd()
    const user = { id: process.env.USER, name: process.env.USER }
    super.onMessage({ id, text: line, chat, user })
  }

  sendMessage(chat, message) {
    console.log(message)
  }
}
```

Let's see what we did here.

First, in the constructor, we listen to [`line`](https://nodejs.org/api/readline.html#readline_event_line) event of node's readline module. Then we created our own version of `.onMessage()` to prepare all info original `.onMessage()` requires and simplest of all, in `.sendMessage()` we just put bot's message to the console. And that's it 🎉.

We now have our own bot class that can communicate with users right in the console.

OK, this example wouldn't be complete without a test. The best approach to testing our `TermBot` is to create [`Dialog`](dialog.md) and try to communicate with the bot. First, we have to import `Dialog` from `@xene/core`. Next, define simple dialog. And instantiate our newly created bot with our dialog.

```ts
import { Bot, Dialog } from '@xene/core'

class TermBot extends Bot { /* implementation of TermBot */ }

class TestDialog extends Dialog {
  static match(msg) { return msg === 'test' }

  async talk() {
    const isGood = await this.ask('Sup, human?', msg => msg === 'good')
    return this.message(isGood ? 'Cool, keep 🤘' : 'Start 🤘')
  }
}

const bot = new TermBot({ dialogs: [TestDialog] })
```

## Reference

### .constructor()
<!--type-->
```ts
constructor(options) -> bot
```

**Arguments**

| Argument | Type   | Description    |
|:---------|:-------|:---------------|
| options  | { dialogs: Dialog[], commands: Command[]} | options is an object with with `dialogs` and `commands` keys. Please note that `Bot` expects arrays of classes of `Dialogs` and `Commands`, not instances. |

**Returns**

| Type    | Description                                       |
|:--------|:--------------------------------------------------|
| Bot | instance of the Bot |
<!--/type-->

A simple example of usage is demonstrated below.

```ts
import { Bot, Dialog, Command } from '@xene/core'

class OwnDialog extends Dialog { /* ... */ }
class OwnCommand extends Command { /* ... */ }

const bot = new Bot({ dialogs: [OwnDialog], commands: [OwnCommand] })
```

### .onMessage()
<!--type-->
```ts
onMessage(message: UserMessage) -> void
```

**Arguments**

| Argument | Type   | Description    |
|:---------|:-------|:---------------|
| message  | UserMessage | a user's message object |
<!--/type-->
