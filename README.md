<div align="center"><img src="assets/hero.png" width="445"/></div>

[![Travis](https://img.shields.io/travis/dempfi/xene.svg?style=flat-square&label=tests)](https://travis-ci.org/dempfi/xene) [![npm](https://img.shields.io/npm/dm/@xene/core.svg?style=flat-square)](https://www.npmjs.com/package/@xene/core) [![first timers only](http://img.shields.io/badge/first--timers--only-friendly-blue.svg?style=flat-square)](http://www.firsttimersonly.com)

Xene is a framework for building conversational bots with modern JavaScript(or
TypeScript). From simple command-based bots to rich natural language bots the
framework provides all of the features needed to manage the conversational
aspects of a bot.

```js
import { Slackbot } from '@xene/slack'

new Slackbot(/* API token */)
  .when(/hi|hello/i).say('Hi there!')
  .when(/talk/i).talk(async dialog => {
    const user = await dialog.bot.users.info(dialog.user)
    const topic = await dialog.ask('What about?', topicParser)
    await dialog.say(`Ok ${user.profile.firstName}, let's talk about ${topic}.`)
    // ...
  })
  .listen()
```

<img src="assets/blank.png" width="1" height="30"/>

## 📦 Packages
Xene is split into different packages for different services and purposes.
There are 2 main packages that differ from rest: `@xene/core` and `@xene/test`.

- [`@xene/core`](https://www.npmjs.com/package/@xene/core) is the place where
  actual conversation API is implemented and all other packages(like
`@xene/slack`) derive from it.
- [`@xene/test`](https://www.npmjs.com/package/@xene/test) defines a convenient
  wrapper to help you test your bots. It works nicely with all other packages
  (Slack or Telegram).
- [`@xene/slack`](https://www.npmjs.com/package/@xene/slack) provides
  `Slackbot` which provides all features to build communication and it also
  provides all [api methods of Slack](https://api.slack.com/methods) with
  promises and in camel case 🙂
- `@xene/telegram` is still in progress but will be as smooth as Slackbot 😉

<img src="assets/blank.png" width="1" height="30"/>

## 💬 Talking

Xene provides two main ways to talk with users — in response to some users'
message and a way to start talking completely programmatically.

### 📥 Starting conversations in response to user's message
To talk with a user when a user says something, first of all, we need to match
user's message. Xene bots provide `.when()` method for this.

```js
import { Slackbot } from '@xene/slack'

new Slackbot(/* API token */)
  .when(/hi|hello/i).talk(dialog => /* ... */)
```

Once user says something that matches, callback passed to `.talk()` will be
invoked with an instance of `Dialog` class. Which provides three main methods
to parse something from most recent users' message(`dialog.parse()`), to say
something to user(`dialog.say()`) and to ask a question to which user can reply
(`dialog.ask()`). Read more about them and Dialog [here](#dialog).

```js
import { Slackbot } from '@xene/slack'

new Slackbot(/* API token */)
  .when(/hi|hello/i).talk(async dialog => {
    await dialog.say('Hi there!')
    const play = await dialog.ask('Wanna play a game?', reply => /yes/i.test(reply))
    // start a game...
  })
```
<div align="center"><img src="assets/ex-1.png" width="400"/></div>

### 📤 Starting conversations proactively

The dialog can also be created proactively when you need them. To do so you can
call `bot.dialog()` method. It expects channel id (slack channel would do) and
an array of users' ids. Rest is the same as in the above example.

```js
import { Slackbot } from '@xene/slack'

const bot = new Slackbot(/* API token */)

const getGloriousPurpose = async () => {
  const dialog = bot.dialog('#channel-id', ['@user1-id', '@user2-id'])
  const purpose = await dialog.ask('Guys, what is my purpose?', reply => reply)
  const comment = purpose === 'to pass butter' ? 'Oh my god.' : 'Nice.'
  await dialog.say(`"${purpose}"... ${comment}`)
  bot.purpose = purpose
  dialog.end()
}

getGloriousPurpose()
```

<div align="center"><img src="assets/ex-2.png" width="400"/></div>

### ⚙️ Dialog API
In the examples above we've been dealing with instances of `Dialog` class.
It provides following methods and properties.

**Click on ▶ to expand reference.**

<details>
<summary>
  <code>Dialog.prototype.bot</code> — access an instance of the Bot to which
  dialog belongs to
  <img src="assets/divider.png" width="100%" height="18"/>
</summary>
<p>

**Signature:**

```ts
bot: Bot
```

<img src="assets/divider.png" width="100%" height="18"/>
</p>
</details>

<details>
<summary>
  <code>Dialog.prototype.channel</code> — the unique id of a channel where the
  dialog is happening
  <img src="assets/divider.png" width="100%" height="18"/>
</summary>
<p>

**Signature:**

```ts
channel: string
```

<img src="assets/divider.png" width="100%" height="18"/>
</p>
</details>

<details>
<summary>
  <code>Dialog.prototype.users</code> — an array of ids of all users to whom
  dialog is attached to
  <img src="assets/divider.png" width="100%" height="18"/>
</summary>
<p>

**Signature:**

```ts
users: Array<string>
```

<img src="assets/divider.png" width="100%" height="18"/>
</p>
</details>

<details>
<summary>
  <code>Dialog.prototype.user</code> — the id of the primary user to whom dialog
  is attached to
  <img src="assets/divider.png" width="100%" height="18"/>
</summary>
<p>

**Signature:**

```ts
user: string
```

<img src="assets/divider.png" width="100%" height="18"/>
</p>
</details>

<details>
<summary>
  <code>Dialog.prototype.on()</code> — add an event listener to life cycle
  events of a dialog
  <img src="assets/divider.png" width="100%" height="18"/>
</summary>
<p>

**Signature:**

```ts
on(event: string, callback: function)
```

**Example:**

```js
dialog.on('end', _ => console.log('Dialog has ended.'))
dialog.on('abort', _ => console.log('Dialog was aborted by user.'))
dialog.on('pause', _ => console.log('Dialog was paused.'))
dialog.on('unpause', _ => console.log('Dialog was unpaused.'))
dialog.on('incomingMessage', m => console.log(`Incoming message ${JSON.stringify(m)}`))
dialog.on('outgoingMessage', m => console.log(`Outgoing message ${JSON.stringify(m)}`))
```

<img src="assets/divider.png" width="100%" height="18"/>
</p>
</details>

<details>
<summary>
  <code>Dialog.prototype.end()</code> — abort dialog, use this to stop dialog
  <img src="assets/divider.png" width="100%" height="18"/>
</summary>
<p>

**Signature:**

```ts
end()
```

**Example:**
For example, this method might be used to abort active dialog when users ask to.

```js
dialog.on('abort', _ => dialog.end())
```


<img src="assets/divider.png" width="100%" height="18"/>
</p>
</details>

<details>
<summary>
  <code>Dialog.prototype.say()</code> — send a message to channel
  <img src="assets/divider.png" width="100%" height="18"/>
</summary>
<p>

**Signature:**
```ts
say(message: Message, [unpause: Boolean = true])
```

**Description:**

Type of the message depends on the bot to which dialog
belongs to. For Slackbot message can be either `string` or message object
described [here](https://api.slack.com/methods/channel.postMessage).

`unpause` is optional it's there to help you control whether dialog should be
unpaused when bot says something or not. By default it's true and the dialog
will be unpaused. [Read more about pause.](#pause)

**Example:**

```js
dialog.say('Hello world!')
dialog.pause('Paused!')
dialog.say('Hi again', false)
```

<img src="assets/divider.png" width="100%" height="18"/>
</p>
</details>

<details>
<summary>
  <code>Dialog.prototype.parse()</code> — parse the most recent message from
  the user
  <img src="assets/divider.png" width="100%" height="18"/>
</summary>
<p>

**Signature:**

```ts
parse(parser: Function || { parse: Function, isValid: Function } , [onError: Message || Function])
```

**Description:**
This method accepts one or two arguments.

If an error handler isn't provided, this method will return the result of the
first attempt to apply parser even if it's an undefined.

**Example:**

```js
new Slackbot(/* API token */)
  .when(/hi/i).talk(async dialog => {
    await dialog.say('Hi!')
    const parser = reply => (reply.match(/[A-Z][a-z]+/) || [])[0]
    const name = await dialog.parse(parser)
    if (!name) await dialog.say("I didn't get your name, but it's OK.")
    else await dialog.say(`Nice to meet you ${name}.`)
  })
```

<div align="center"><img src="assets/ex-3.png" width="400"/></div>

If there is an error handler xene will call it for every failed attempt to parse
user's message. Xene counts all parsing failed if `null` or `undefined` were
returned from parser function. To fine-tune this behavior you can pass an object
as a parser with two methods — `parse` and `isValid`. Xene will call `isValid`
to determine if parsing failed.

```js
new Slackbot(/* API token */)
  .when(/invite/i).talk(async dialog => {
    const parser = {
      parse: reply => reply.match(/[A-Z][a-z]+/),
      isValid: parsed => parsed && parsed.length
    }
    const names = await dialog.parse(parser, 'Whom to invite?')
    // ...
  })
```

<div align="center"><img src="assets/ex-4.png" width="400"/></div>

<img src="assets/divider.png" width="100%" height="18"/>
</p>
</details>

<details>
<summary>
  <code>Dialog.prototype.ask()</code> — ask a question to user and parse
  response to the question
  <img src="assets/divider.png" width="100%" height="18"/>
</summary>
<p>

**Signature:**

```ts
ask(question: Message, parser: Function || { parse: Function, isValid: Function }, [onError: Message || Function])
```

**Description:**

Ask the `question` to a user and parse the response from the user to the question.
If parsing fails and error handler `onError` is defined it will be called. If
error handler `onError` isn't defined than question will be asked again.

**Example:**

```js
new Slackbot(/* API token */)
  .when(/hi/i).talk(async dialog => {
    await dialog.say('Hi!')
    const parser = reply => (reply.match(/[A-Z][a-z]+/) || [])[0]
    const name = await dialog.ask('How can I call you?', parser, 'Sorry?')
    await dialog.say(`Nice to meet you, ${name}.`)
  })
```

<div align="center"><img src="assets/ex-5.png" width="400"/></div>
This example also shows us importance of better parser then one based on capital
letter in front of the words 😅.

<img src="assets/divider.png" width="100%" height="18"/>
</p>
</details>

<details>
<summary>
  <code>Dialog.prototype.pause()</code> — pause dialog, reply with pause message
  until unpaused
  <img src="assets/divider.png" width="100%" height="18"/>
</summary>
<p>

**Signature:**

```ts
pause(message: Message)
```

**Description:**

Reply to all incoming user's messages with `message` until the dialog is
unpaused. Dialog unpauses when a message is sent to user or question is asked
(`.say()` and `.ask()` methods). This method can help your bot to give status to
a user during some heavy calculation.

**Example:**
```js
new Slackbot(/* API token */)
  .when(/meaning of life/i).talk(async dialog => {
    dialog.pause(`Wait human, I'm thinking...`)
    await dialog.say('OK, let me think about this.', false)
    await new Promise(r => setTimeout(r, 24 * 60 * 60 * 1000)) // wait 24 hours
    await dialog.say('The answer is... 42.')
  })
```
<div align="center"><img src="assets/ex-6.png" width="400"/></div>

<img src="assets/divider.png" width="100%" height="18"/>
</p>
</details>

<img src="assets/blank.png" width="1" height="30"/>

## ✅ Testing bots

Xene provides [test](https://www.npmjs.com/package/@xene/test) module to stub
your bot and run assertions.

For example, let's test following bot:

```js
const quizzes = {
  math: [ { q: '2 + 2 = x', a: '4' }, { q: '|-10| - x = 12', a: '2' }],
  // other quizes
]

const meanbot = new Slackbot(/* API token */)
  .when(/hi/i).say('Hi there')
  .when(/quiz/i).talk(async dialog => {
    const kind = await dialog.ask('Ok, what kind of quizzes do you prefer?')
    for (const quiz of quizes[kind]) {
      const answer = await dialog.ask(quiz.q, reply => reply)
      if (answer === quiz.a) await dialog.say('Not bad for a human.')
      else await dialog.say(`Stupid humans... Correct answer is ${quiz.a}.`)
    }
    await dialog.say(`These are all ${kind} quizes I've got.`)
  })
```

First, to be able to test the bot we need to wrap it in tester object to get
access to assertions methods. The exact same thing as with Sinon but assertions
provided by `@xene/test` are dialog specific. Anyhoo, let's write the first
assertion.

```js
imoport ava from 'ava'
import { wrap } from '@xene/test'

const subject = wrap(meanbot)

test('It does reply to "hi"', async t => {
  subject.user.says('Hi')
  t.true(subject.bot.said('Hi there'))
  // or the same but in one line
  t.true(await subject.bot.on('Hi').says('Hi there'))
})
```

That was simple. But dialogs can be quite complicated and to test them we need
to write more stuff.

```js
test('It plays the quiz', async t => {
  subject.user.says('quiz')
  subject.user.says('math')
  t.true(subject.bot.said('2 + 2 = x')
  t.true(await subject.bot.on('1').says('Not bad for a human.'))
  t.true(await subject.bot.on('1').says('Stupid humans... Correct answer is 2.'))
  t.is(subject.bot.lastMessage.message, "These are all math quizes I've got.")
  t.is(subject.bot.messages.length, 6)
})
```

This is it, there are minor things that might be useful in more advanced
scenarios. For example, each assertion method can also take user id and channel
id. Check out API to learn about them.

<img src="assets/blank.png" width="1" height="30"/>

#### TypeScript
Xene is written in TypeScript and npm package already includes all typings.

<div align="right"><sup>
  made with ❤️ by <a href="https://github.com/dempfi">@dempfi</a>
</sup></div>
