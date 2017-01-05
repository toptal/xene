# Dialogs

Xene uses dialogs as basic component for describing communications with users, most of the talking logic you will write in dialogs. And it's pretty easy to do: you just subclass from base `Dialog` class and implement method to talk(`talk`) and either `match` or `isDefault` property.

## First steps
Let's create simple dialog class and teach our bot to reply to greetings.

```ts
import Consolebot from 'xene/bots/console'
import Dialog from 'xene/dialog'

class Greeting extends Dialog<Consolebot> {
  static match(message: string) {
    return /hi/i.test(message)
  }
  async talk() {
    this.message("Hi master!")
  }
}

const bot = new Consolebot({ dialogs: [ Greeting ] })
```

Here we implemented static method `match` which will be called by `Bot` to check if user message is suitable for this dialog. And method `talk` which will be called once `match` returned `true`.

Now we send **Hi** message to our bot and bot will reply with **Hi master!** prase. That's great 🎉, our bot is alive now. But what will happen if we send some message like **What's up?** or anything else? Nothing, that's sad but our bot will just stay quiet because he doesn't know how to engage in dialogs starting with such messages.

But we can teach him to say something instead of silence.

Let's add simple dialog class for cases when bot didn't undesrand the user.

```ts
// ...
class Default extends Dialog<Consolebot> {
  static isDefault = true
  async talk() {
    this.message("I didn't understand you :(")
  }
}

const bot = new Consolebot({ dialogs: [ Greeting, Default ] })
```

Here we created just another dialog which will be used when all other dialog's `match` methods return `false`. And if it happens our bot will say **I didn't understand you :(**. To archive this we set static property `isDefault` to `true` to empesize that this dialog is a default dialog.

_Note: In real project it's better to add some valuable information to default dialog, like `help`, so user will know how to interact with your bot._

## Few words about type-safety

Let's take a look to our dialogs one more time, to the `Dialog<Consolebot>` part. Here we pass class of our bot as generic type argument. It's important becuase different type of bots(`Consolebot`, `Slackbot`, `Reactbot` etc) can send different type of message. `Consolebot` for example can send only `string`s but `Slackbot` can send files and rich attachments and to have typechecking for all this cool things we should know what type of bot is running our dialogs. That's it.

## `Dialog` class methods

### `Dialog#talk`
```ts
talk() => Promise<void>
```
All communication logic(send message, parse, ask something) during dialog lifecycle are located here. This method is called by `Bot` if user's message is a start for this dialog. When `Promise` returned by `talk` is resolved, `Bot` counts that as end of the dialog and will not send next messages to this dialog, but run `match` on dialogs and try to find next suitable dialog.

### `Dialog#message`
```ts
message(msg: Message) => Promise<void>
```
`message` method will send formatted messages to users and return `Promise` with result of api call.

To learn more about message formatting, check [formatting spec](PASTE THE LINK).

**NOTE: `Message` is a message type defined in bot class**

### `Dialog#parse`
`parse` as it states in the name is obviously to parse user's messages. When you call `parse` with parser, it will create a `Promise` for you whihc will be resolved with result of parsing the user message. To undersatnd this better let's take a look at example:

```ts
class Weather extends Dialog<Consolebot>{
  // some weather logic . . .
  async talk() {
    const {message, parse} = this
    message('Give me a second, connecting WeatherChannel...')
    const speciedLocation = await parse<string>(locationParser)
    const location = speciedLocation || this.currentUserLocation()
    message(`Weather in ${location} is a ${this.weatherInLocation(location)}`)
  }
}
```

Only call of `parse` method is important in this example which we call with some parser `locationParser` function([read more about parsers](PASTE LINK HERE)). What it parses you may ask? Under the hood each `Dialog` has queue of parsers and `Dialog` takes parsers from that queue and applies to last user message untill queue is empty or parser failed to parse. In our example `locationParser` will run on initial user message.

Method `parse` is overloaded and even tho is generic, and the behaviour of function is slighly different depending on arguments. But don't worry, it's still very easy to understand.

#### 1.
```ts
parse<T>(parserFunc: (msg: string) => T) => Promise<T>
```
if you call parse with only parser function, it will just apply it to last message and return any value `parserFunc` returned

#### 2.
```ts
parse<T>(parserFunc: (msg: string) => T, errorMessage: Message) => Promise<T>
```
if you apply `parse` with `errorMessage` message then it will send it to user if `parserFunc` returns falsy value(null, undefined) and parser will stay in queue and wait for `parserFunc` to return some non-falsy value

#### 3.
```ts
parse<T>(
  parserObject: {
    parse: (msg: string) => T,
    check: (parsed: T) => boolean
  },
  errorMessage: Message
) => Promise<T>
```
this is the same as in [3.](#3) but with parser's return value will be counted as falsy only if `check` returns false. [Read more about parser](PASTE LINK HERE)

#### 4.
```ts
parse<T>(parserFunc: (msg: string) => T, errorCallback: (msg: string, parsed: T) => void) => Promise<T>
```
same as [2.](#2) but bot will not send message to user but return control to user defined `errorCallback` function

#### 5.
```ts
parse<T>(
  parserObject: {
    parse: (msg: string) => T,
    check: (parsed: T) => boolean
  },
  errorCallback: (msg: string, parsed: T) => void
) => Promise<T>
```
mix of [3.](#3) and [4.](#4)


### `Dialog#ask`
`ask` is a you helper to get some missing information from user and build great dialog flows. It is in essence a combination of `message` and` parse`. If you want to implement your own method `ask` it would look something like this:

```ts
class Dialog {
  async ask<T>(msg, parser, errorCallback?) {
    await this.message(msg)
    return this.parse<T>(parser, errorCallback)
  }
}
```

Very easy, right? But with `ask` you can build very complex dialogs. Let's improve our example with the weather dialog using the `ask`:

```ts
class Weather extends Dialog<Consolebot>{
  // some weather logic . . .
  async talk() {
    const {message, parse, ask} = this
    message('Give me a second, connecting WeatherChannel...')
    const speciedLocation = await parse<string>(locationParser)
    const daysForecast = await ask<number>('For how many days you need forecast?', dateNumberParser)
    const location = speciedLocation || this.currentUserLocation()
    message(`Weather in ${location} for ${daysForecast} is a ${this.weatherInLocation(location)}`)
  }
}
```

as you see with one line of code we got additional info and made our bot more talkative and human-like.

Since `ask` is a combination of `message` and `parse`, its argumants are also combination of them.

#### 1.
```ts
ask<T>(message: Message, parserFunc: (msg: string) => T) => Promise<T>
```
if `parserFunc` will return falsy value, then `message` will be send one more time untill `parserFunc` hi will return non-falsy value

#### 2.
```ts
ask<T>(
  message: Message,
  parserObject: {
    parse: (msg: string) => T
    check: (parsed: T) => boolean
  }
) => Promise<T>
```
same as in [1.](#1) but returned value of `parse` will be checked by `check` untill it's not a `false`

#### 3.
```ts
ask<T>(message: Message, parserFunc: (msg: string) => T, errorMessage: Message) => Promise<T>
```
same as [1.](#1) but if parser fails then `errorMessage` will be send instead of `message`

#### 4.
```ts
ask<T>(
  message: Message,
  parserObject: {
    parse: (msg: string) => T
    check: (parsed: T) => boolean
  },
  errorMessage: Message
) => Promise<T>
```
same as [3.](#3) but return value of `check` will be checked to not be `false` instead of check for falsy return value on `parse` fucntion

#### 5.
```ts
ask<T>(
  message: Message,
  parserFunc: (msg: string) => T,
  errorCallback: (msg: string, parsed: T) => void
) => Promise<T>
```
same as [3.](#3) but instead of sending message `Bot` will call `errorCallback`

#### 6.
```ts
ask<T>(
  message: Message,
  parserObject: {
    parse: (msg: string) => T
    check: (parsed: T) => boolean
  },
  errorCallback: (msg: string, parsed: T) => void
) => Promise<T>
```
same as [5.](#5) but return value of `check` will be checked
