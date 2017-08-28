<div align="center"><img src="http://imgur.com/YgPmLct.png" width="445"/></div>

<div align="center">
  <a href="https://travis-ci.org/dempfi/xene">
    <img src="https://travis-ci.org/dempfi/xene.svg?branch=master" />
  </a>
</div>

```js
import { Slackbot } from '@xene/slack'
const bot = new Slackbot({ botToken: 'xxx-token' })
```
```js
// Match with regular expression
bot.when(/hi|hey|hello/i)
  // and just reply with some message
  .say('Hi there!')
```
```js
// Match exact string
bot.when('stop it')
  // and execute some function with bot and message
  .do((msg, bot) => bot.abortDialog(msg.chat, msg.user))
```
```js
// Match with function
bot.when(msg => msg.text === 'I want pizza!')
  // and start new dialog with user
  .talk(async (dialog, bot) => {
    // load complete profile of user using Slack specific API
    const user = await bot.users.info(dialog.user)

    // and ask any question and await for user to answer
    const withPepperoni = await dialog.ask('With pepperoni?', (msg) => msg === 'yes')

    // do something with user's reply
    placePizzaOrder(dialog.user, { pepperoni: withPepperoni })
    await dialog.say(`Ok, ${user.profile.firstName}, you pizza is on its way. `)
  })
```

Xene is a framework for building conversational bots either with modern JavaScript. From simple command based bots to rich natural language bots the framework provides all of the features needed to manage the conversational aspects of a bot.

### Packages
Xene is split into different packages and depending on with which service your bot should work you should install appropriate package.
All bot packages extend Core bot package with APIs specific to that service. And all conversational API is implemented in core. This means you can use same API to build conversation in Slack or Telegram and that it's relatively easy to add new service since all you need to do is to subclass base Bot class from Core package and add 3 methods to interact with that service.

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
