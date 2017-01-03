Xene is a framework for building conversational bots either on Typescript or ES6. From simple command based bots to rich natural language bots the framework provides all of the features needed to manage the conversational aspects of a bot. You can easily connect bots built using the framework to your users wherever they converse, from Slack to site to console

## Let's start

Just run `yarn add xene` to install xene.
_xene is written in TS, so typeings are already provided in xene module_

## Simplest bot

Once you have installed the bot we can start creating our bot. Fist thing we have to dicede what kind of bot we will build? With xene we can build bot for Slack, browser or console. To not complicate things, let's go with console bot. We can interact with him via command line interface. All bot subtypes are located at `xene/bots`.

```ts
import Consolebot from 'xene/bots/console'
const bot = new Consolebot()
```

if you run this script `bot` will await for your messages but he can't reply, because he doesn't know what to say :(

Let's teach him how to say __hi__

## First dialog
Toi say hi we define a simple `Dialog`

```ts
import Consolebot from 'xene/bots/console'
import Dialog from 'xene/dialog'

class Greeting extends Dialog<Consolebot> {
  static match (message: string) {
    return /hi/i.test(message)
  }

  async talk () {
    await this.message('Hi master!')
  }
}
const bot = new Consolebot({ dialogs: [ Greeting ] })
```

Let's go line by line and see what we've done.

Here the most important part for us is the `Dialog<Consolebot>`. We pass through type of our bot to get more occurate type checking. `Dialog`'s `message` method's argument is depending on the type of bot. For `Consolebot` it will be `string` but for `Slackbot` it will be either `string` or `IMessage` interface.
```ts
class Greeting extends Dialog<Consolebot> {}
```

Then we override static `match` method. This method called by `Bot` to find out best dialog that matches last user's message if user doesn't have active dialogs(We'll get back to this later.)
Its type is `match(message: string) => boolean`.

