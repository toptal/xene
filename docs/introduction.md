---
id:       introduction
category: quick-start

---

# Introduction

Nowadays we (developers) have access to hell lot of APIs of different messengers. From Slack to iMessage. This gives us amazing ability to create really simple, human-like interfaces for our users in the way that is very personal, funny, efficient and sometimes cute 🤖. But this area is still not really explored...

## The Problem

I have been working with APIs of Slack and Skype simultaniously to create bot interfaces for our users. It was great experience to play with all the ML and nlp techs but unfortunatly I had hard time integrating both APIs in one app, with all the different concepts of both messengers. And this is the problems I had in my project:

- **Each service provides different API for same things.** There are nothing like TC39 to standratize basic common things — format, send and recieve messages. So we either write layers of abstractions by ourselfes or use some library with support for all messengers. Which leads us to the next problems.

- **Existing libraries don't utilize power of each API.** Right now there are two major libraries with support for different messengers and both trying hard to be the bridge and they both suck at basics. For example take a look at this example from [Botkit's docs](https://github.com/howdyai/botkit/blob/master/docs/readme.md#receiving-messages).

```ts
// reply to a direct mention - @bot hello
controller.on('direct_mention',function(bot,message) {
  // reply to _message_ by using the _bot_ object
  bot.reply(message,'I heard you mention me!');
});
```

It seems very legit and understandable, but in fact it's bound to Slack API, because we listen to `direct_mention` event which is Slack specific. So if you use Botkit, you still have to write a lot of code to support different APIs of different messengers.

- **Existing libraries are complex.** I had to read [Get Started](https://github.com/howdyai/botkit/blob/master/docs/readme.md) guide of Botkit and it's still not clear what the hell chains of callbacks do.

## The Solution

**Meet `xene`.**

The key concept of xene is that it trully provides **one** interface for chatting, _but_ in the same time all cool features of each messengers are still available.

```ts
import Slackbot from '@xene/slack'
import { Dialog } from '@xene/core'

class Greeting extends Dialog {
  static match = msg => /(hi|hello)/i.test(msg)
  async talk() {
    await this.message('Hi ${user.name}')
    const isGreat = await this.ask('How is your day?', reply => /(great|good)/i.test(reply))
    return this.message(isGreat ? 'Cool, keep up human.' : "Oh, sorry to hear.")
  }
}

const bot = new Slackbot({ dialogs:[ Greeting ], /* tokens */ })
```

**Basics are same.** Xene provides `Dialog`s for conversations in which you can `message`, `ask` and `parse`. This is very simple idea and it's constant no matter what messenger your users use.

**`async/await` is much simpler for conversations.** Xene is all about Promises and it's designed with `async/await` in mind. You can just await for user to reply to your question.

```ts
const isGreat = await this.ask('How is your day?', reply => /(great|good)/i.test(reply))
```
