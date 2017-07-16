---
id:       introduction
category: quick-start

---

# Introduction

<!--intro-->
...to simple, modern bot framework.
<!--/intro-->

xene is a **modular**, **modern**, **simple** to use and **easy to extend** bot framework. It allows developers conversational bots that work with different messengers in the same way and in the same time doesn't limit any API of messengers.

**Modular** xene provides two main packages `@xene/core` and `@xene/tester`. `@xene/core` provides core classes such as `Dialog` to describe conversations, `Command` to control the conversation with higher priority over `Dialog` and `Bot` that is consumed by other messenger specific packages to bind their APIs. `@xene/tester` is helper package that you can use to write highly efficient tests for your `Dialog`s and `Command`s;

**Modern** xene utilizes power of modern JavaScript using ES2015 classes to describe basic blocks, promises and async/await to describe conversational flow in the most clear way;

**Simple** xene takes care under the hood of most common patterns such as handling simultaneous conversation with different users in one group(channel), or handling parse errors when bot didn't understand user and many other common things all handled by xene's core and configurable in place with simple API;

**Easy to extend** `Slackbot` from `@xene/slack` package is just a subclass of `Bot` from `@xene/core` with two `super` calls. Same for any other bot of any messenger. This is all because core package was designed as simple building block without limitations for end users.


All that together results in this simple example.

```ts
import { Dialog } from '@xene/core'
import { Slackbot } from '@xene/slack'
import { Consolebot } from '@xene/console'

class Greeting extends Dialog {
  static match(msg) { return /(hi|hello)/.test(msg) }

  async talk() {
    const isGood = await this.ask('Sup, human?', msg => /(good|great)/.test(msg))
    return this.message(isGood ? 'Keep rocking man 🤘' : 'Oh, sorry to hear...')
  }
}

const slackbot = new Slackbot({ dialogs: [Greeting], /* Slack API tokens */ })
const consolebot = new Consolebot({ dialogs: [Greeting] })
```

Here we created simple `Greeting` dialog which works with both Slack API and in your console.
