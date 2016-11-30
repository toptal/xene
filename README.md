## Installation
```
npm i --save xene
```

## Create a bot
To write your own bot you have to either subclass `Bot` class or instantiate it.
And you always have to pass one of adapters from available adapters.

```ts
import Bot from 'xene/bot'
import Slack from 'xene/adapters/slack'

class MyAwesomeBot extends Bot {
  constructor () {
    const adapter = new Slack('XXX-token')
    super({adapter, scenarios: [], commands: []})
  }

  @Bot.on('message.send')
  doSomethingWithMessage (message) {
    // ...
  }
}
```

or to use it as a service

```ts
import Bot from 'xene/bot'
import Slack from 'xene/adapters/slack'

const adapter = new Slack('XXX-token')
const bot = new Bot({adapter, scenarios: [], commands: []})
bot.on('message.send', (message) => /* ... */)
```

## Commands
Commands are one time actions with optional message sent to user. They are higher
in priority than scenarios, so with commands you can control lifecycle of
scenarios, for example:

```ts
const stop = {
  matcher: (txt: string) => txt == 'stop',
  action: (chat, message) => chat.performers.delete(message.user),
  message: 'Ok, {user.firstName}',
}

const bot = new Bot({adapter, scenarios: [], commands: [stop]})
```

## Scenario
Usefull for defining conversational flows. You can either manually start performing
scenario in some channel or automatically by user message. When bot recieves user
message, it will try to find active chat with user if it fails, then bot will find
matching scenario to user message and create new chat with user with that
scenario.

For example if we want to collect user's feedback, we'd define next scenario

```ts
import * as q from 'xene/queries'

const feedback = {
  title: 'feedback',
  macther: (msg) => /\b(feedback)\b/ig.test(msg),
  queries: [
    q.message('Awesome, {user.firstName}'),

    q.question('How would you evaluate your experience with me on a scale of `1` to `5`, where `1` is poor and `5` is great?', {
      parser: _.parseInt,
      validators: [
        {
          validator: (n) => _.isNumber(n) && n <= 3,
          message: 'I will do my best to improve and become best robot ever :robot_face:'
        },
        {
          validator: (n) => _.isNumber(n) && n > 3 && n <= 5,
          message: "OMG, I'm happiest robot ever :relaxed:. Thank you, {user.firstName}."
        }
      ]
    }),

    q.question('If you'd like to add a comment, it's the time.', {
      parser: parsers.raw,
      validators: [
        {
          validator: (p) => p === 'no',
          message: 'Thanks for feedback!'
        },
        {
          validator: (p) => p !== 'no',
          message: 'Thanks for letting me know!'
        }
      ],
      exit: true
    })
  ]
}

const bot = new Bot({adapter, scenarios: [feedback], commands: []})
```
