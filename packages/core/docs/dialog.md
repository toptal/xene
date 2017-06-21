---
id:       dialog
prev:     bot
category: reference

---

# Dialog

<!--intro-->
React.Component for conversations.
<!--/intro-->

The dialog is an abstract base class and core concept of xene. It allows you to define conversational flow with ES2017’s async/await and split complex conversational logic to small pieces. You will typically subclass it, and define `talk()` and static `match()` methods, like in the example below.

```ts
import { Dialog } from '@xene/core'

class Greeting extends Dialog {
  static mathc(msg) { return msg }
  async talk() {
    await this.message('hi ${user.name}')
  }
}
```

## Dialog's Lifecycle

Each dialog has lifecycle methods that you can override to run code at particular times in the conversations. Each dialog lives as long as `talk()` method is active. Once it resolves, a dialog is complete and garbage collected.

### Matching
Static `match()` method is called every time user tries to communicate with a bot if there aren't any active dialog with that user.

- [`static match()`](#static-match)

### Initiating
These methods are called once dialog's static `match()` method resolves to `true`:

- [`constructor()`](#constructor)
- [`onStart()`](#onstart)
- [`talk()`](#talk)

### Talking
During conversation with user for each send message and received message these methods are called:

- [`onIncomingMessage()`](#onincomingmessage)
- [`onOutgoingMessage()`](#onoutgoingmessage)

### Сlosing
These methods are called once dialog ends either naturally or by request from the user:

- [`onEnd()`](#onend)
- [`onAbort()`](#onabort)

## Core APIs

To communicate with users each dialog provides these methods using which you can define the conversational flow:

- [`message()`](#message)
- [`parse()`](#parse)
- [`ask()`](#ask)

## Reference

### static match()
<!--type-->
```ts
static match(message) -> Boolean
```

**Arguments**

| Argument | Type   | Description    |
|:---------|:-------|:---------------|
| message  | String | a user message |

**Returns**

| Type    | Description                                         |
|:--------|:----------------------------------------------------|
| Boolean | indicates if the `message` is a start of the Dialog |
<!--/type-->

Method `match()` is used by xene to match user's messages with defined dialogs. It's called when there aren't any active dialogs in the [chat](chat) with a user. If you'll not override it and define matcher for your dialog, xene will use the default one, which always evaluates to `false`.

### .constructor()
<!--type-->
```ts
constructor(bot, chat) -> Dialog
```

**Arguments**

| Argument | Type   | Description                                           |
|:---------|:-------|:------------------------------------------------------|
| bot      | Bot    | instance of the xene bot to which a dialog belongs to |
| chat     | String | a chat id                                             |

**Returns**

| Type   | Description               |
|:-------|:--------------------------|
| Dialog | an instance of the dialog |
<!--/type-->

Very rarely you'll have to override constructor since both `bot` and `chat` are available as properties of the dialog.

### .onStart()
<!--type-->
```ts
onStart() -> void
```
<!--/type-->

`onStart()` called right before the `talk()` method. Main difference between overriding the `constructor()` and `onStart()` is that when `onStart()` is called `user` propertie exists on the dialog, which is not true for the `constructor()`.

### .talk()
<!--type-->
```ts
talk() -> Promise
```

**Returns**

| Type    | Description                           |
|:--------|:--------------------------------------|
| Promise | a queue of a conversation with a user |
<!--/type-->

`talk()` is called by xene, you don't need to call it by yourself. It's like `render()` function in react.js and like `render()` this is a method where you will implement business logic(send a message, parse, ask something). `talk()` is an `async` function and xene counts dialog as active unless `talk()` is resolved.

### .onIncomingMessage()
<!--type-->
```ts
onIncomingMessage(message) -> void
```
**Arguments**

| Argument | Type   | Description  |
|:---------|:-------|:-------------|
| message  | String | user message |
<!--/type-->

Xene calls `onIncomingMessage()` on each new message from a user in current dialog.

### .onOutgoingMessage()
<!--type-->
```ts
onOutgoingMessage(message) -> void
```
**Arguments**

| Argument | Type   | Description  |
|:---------|:-------|:-------------|
| message  | Message | bot message |
<!--/type-->

Xene calls `onOutgoingMessage()` on each new message bot sends during dialog's lifecycle.

### .onEnd()
<!--type-->
```ts
onEnd() -> void
```
<!--/type-->

`onEnd()` is called when a conversation is naturally resolved.

### .onAbort()
<!--type-->
```ts
onAbort([error]) -> void
```
<!--/type-->

`onAbort()` is called when conversation is aborted via [`Bot#stopDialog()`] method call or when error occures in `talk()` method. In second case `onAbort()` will be called with the error.

### .message()
<!--type-->
```ts
message(message) -> Promise
```

**Arguments**

| Argument | Type    | Description |
|:---------|:--------|:------------|
| message  | Message | bot message |

**Returns**

| Type    | Description                   |
|:--------|:------------------------------|
| Promise | result of `Bot#sendMessage()` |
<!--/type-->

The purpose of the `message()` method is to send the messages to the users. The exact format of the message that will be sent to the users is defined in each bot separately.

Xene always formats message you pass to the `message()` function and this is not related to the type of the `Message` defined in the bots (`string`, `object`, `array`). It uses [lodash's string templates](https://lodash.com/docs/#template) with default presets and imports current dialog to the template. To better understand the concept, take a look at the example bellow.

```ts
class Greeting extends Dialog {
  static isDefault = true
  randomGreeting() {
    return randomElement(['Good day', 'Hi', 'Hello'])
  }

  async talk() {
    await this.message('${randomGreeting()} ${user.name}.')
  }
}
```

**NOTE: `Message` is a message type defined in bot class**

### .parse()
<!--type-->
```ts
parse(parser, [onError]) -> Promise{parsedValue}
```

**Arguments**

| Argument | Type                                 | Description                                                                                                                                                                                                                                                                                                                                                                                        |
|:---------|:-------------------------------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| parser   | Parser                               | the parser that will be used to parse a user's message. It can be a function that accepts user's message and returns either parsed value or falsy value, or an object with `parse()` and `check()` methods. `parse()` is same and `check()` is called with result of the call to `parse()` and expected to return `true` or `false` to check if parse did succeed. [Read more here](PUT LINK HERE) |
| onError  | Bot Message or (msg, parsed) -> void | error handler to use if the parsing failed. If `onError` is a `Bot Message`, then it will be just sent to the user. If it's an error handler, then it will be called with user's message and result of `parser` call                                                                                                                                                                               |

**Returns**

| Type    | Description                            |
|:--------|:---------------------------------------|
| Promise | result of call to the successful parse |
<!--/type-->


`parse()` method invokes parser on the most recent message from the user. If the dialog was initiated from the user's message then it will be immediately invoked. But if the dialog was initiated from the [`Bot#startDialog()`](PUT LINK HERE) then `parse()` will register new parser in [parsing queue](LINK), await for new user message and invoke parser with that new message. Let's examine an example for clarity.

```ts
class Sum extends Dialog {
  static match(message) { return /\d\s*?\+\s*?\d/.test(message) }

  async talk() {
    const numbers = await this.parse(numbersParser)
    await this.message(`${numbers.join(' + ')} equals to ${_.sum(numbers)}`)
  }
}
```
Here we have simple dialog which sums numbers for the user. When our user asks what the sum is for `2 + 4 + 7` we can parse that message and say `2 + 4 + 7 equals to 13`.

If `onError` argument isn't provided, then xene will return a result of parsing of a user's message without a check for its actual value. If it is present and it isn't a function then xene will try to send it to the user every time parsing fails and keep trying to parse new messages with the same parser until it parses successfully. If it's a function, then xene will call it with user's message and a result of the call to the parsing function.

```ts
// Somewhere in the talk method . . .
const numbersParser = {
  parse: msg => /\d*?/g.match(msg),
  check: arr => arr.length > 0
}

// this will run parser once and return the value without checking
// the parsed value with numbersParser.check
const parsed = this.parse(numbersParser)


// this will run parser as many times as needed for numbersParser.check
// to return true. And each time check fails, it will send the error
// message to the user
const parsed = this.parse(numbersParser, 'Gimme the numbers, human!')
```

### .ask()

<!--type-->
```ts
ask(message, parser, [onError]) -> Promise{parsed}
```

**Arguments**

| Argument | Type                    | Description |
|:---------|:------------------------|:------------|
| message  | Bot Message             | a question which will be send to the user. It should have compatible type with message of derived bot |
|parser    | Parser                  | a parser that will be used to parse a user's reply. It can be a function that accepts user's message and returns either parsed value or falsy value, or an object with `parse()` and `check()` methods. `parse()` is the same and `check()` is called with result of the call to `parse()` and expected to return `true` or `false` to check if parse did succeed. [Read more here](PUT LINK HERE) |
| onError    | Bot Message or (reply, parsed) -> void | error handler to use if the parsing fails. If `onError` is a `Bot Message`, then it will be just sent to the user. If it's an error handler, then it will be called with user's message and result of `parse()` call |

**Returns**

| Type    | Description                            |
|:--------|:---------------------------------------|
| Promise | result of call to the successful parse |
<!--/type-->

`.ask()` method is to ask questions to a user and parse response in place. Basically, it's a combination of `.message()` and `.parse()` with minor change — `Parser` passed to `.ask()` will be executed with reply message from the user, not with the most recent message as in `.parse()`.

```ts
import { Dialog } from '@xene/core'

class Greeting extends Dialog {
  static mathc(msg) { return msg }
  async talk() {
    await this.message('Hi ${user.name}')
    const reply = await this.ask('How is your day, ${user.name}?', rawParser)
  }
}
```

as you see with one line of code we got additional info and made our bot more talkative and human-like.

If `onError` handler provided and an error occures during parsing of the user's reply `.ask()` will use `onError`. Just like in `.parse()`. But unlike `.parse()` `.ask()` is strict. Which measn if `onError` isn't provided `.ask()` will not return failed parsing result but will repeat the question until it gets a suitable answer.
