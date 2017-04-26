---
id:       dialog
category: reference

---

# Dialog

<!--intro-->
It’s like React.Component but for conversations.
<!--/intro-->

The dialog is an abstract base class and core concept of xene. It allows you to define conversational flow with ES2015’s async/await and split complex conversational logic to small pieces. You will typically subclass it, and define at `talk()` and static `match()` methods, like in the example below.

```ts
class Greeting extends Dialog {
  static mathc(msg) { return msg }
  async talk() {
    await this.message('hi ${user.name}')
  }
}
```

## The Dialog Lifecycle

Each dialog has lifecycle methods that you can override to run code at particular times in the conversations. Each dialog lives as long as `talk()` method is active. Once it resolves, a dialog is complete and garbage collected.

### Matching
Static `match()` method is called every time user tries to communicate with a bot if there aren't any active dialog with that user.

- [`static match()`](#static-match)

### Initiating
These methods are called once dialog's static `match()` method resolves to `true`:

- [`constructor()`](#constructor)
- [`onStart()`](#onStart)
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

| Type    | Description                                       |
|:--------|:--------------------------------------------------|
| Boolean | indicates if the `message` a start for the dialog |
<!--/type-->

Method `match()` is used by xene to match user's messages with defined dialogs. It's called when there aren't any active dialogs in the [chat](chat) with a user. If you'll not override it and define matcher for your dialog, xene will the default one, which always evaluates to `false`.

### .constructor()
<!--type-->
```ts
constructor(bot, chat) -> Dialog
```

**Arguments**

| Argument | Type   | Description                                           |
|:---------|:-------|:------------------------------------------------------|
| bot      | Bot    | instance if the xene bot to which a dialog belongs to |
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

| Type    | Description                             |
|:--------|:----------------------------------------|
| Promise | a queue of the conversation with a user |
<!--/type-->

`talk` is called by xene, you don't need to call it by youself. It's like `render` function in react.js and like `render` this is a method where you will start business logic(send a message, parse, ask something). `talk` is an `async` function and xene counts dialog as active unless `talk` is resolved.

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

`talk` is called by xene, you don't need to call it by youself. It's like `render` function in react.js and like `render` this is a method where you will start business logic(send a message, parse, ask something). `talk` is an `async` function and xene counts dialog as active unless `talk` is resolved.

### .onOutgoingMessage()
<!--type-->
```ts
onOutgoingMessage(message) -> void
```
**Arguments**

| Argument | Type   | Description  |
|:---------|:-------|:-------------|
| message  | String | user message |
<!--/type-->

`talk` is called by xene, you don't need to call it by youself. It's like `render` function in react.js and like `render` this is a method where you will start business logic(send a message, parse, ask something). `talk` is an `async` function and xene counts dialog as active unless `talk` is resolved.

### .onEnd()
<!--type-->
```ts
onEnd() -> void
```
<!--/type-->

`talk` is called by xene, you don't need to call it by youself. It's like `render` function in react.js and like `render` this is a method where you will start business logic(send a message, parse, ask something). `talk` is an `async` function and xene counts dialog as active unless `talk` is resolved.

### .onAbort()
<!--type-->
```ts
onAbort() -> void
```
<!--/type-->

`talk` is called by xene, you don't need to call it by youself. It's like `render` function in react.js and like `render` this is a method where you will start business logic(send a message, parse, ask something). `talk` is an `async` function and xene counts dialog as active unless `talk` is resolved.

### .message()
<!--type-->
```ts
message(message) -> Promise
```

**Arguments**

| Argument | Type   | Description  |
|:---------|:-------|:-------------|
| message  | String | user message |

**Returns**

| Type   | Description  |
|:-------|:-------------|
| String | user message |

<!--/type-->

`Message` -
Send formatted messages to users and return `Promise` with result of api call.
<!-- about formatting -->

To learn more about message formatting, check [formatting spec](PASTE THE LINK).

**NOTE: `Message` is a message type defined in bot class**

### .parse()
`parse` as it states in the name is obviously to parse user's messages. When you call `parse` with a parser, it will create a `Promise` which will be resolved with the result of parsing a user message. To understand this better let's take a look at the example:

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

The only call of `parse` method is important in this example which we call with some parser `locationParser` function([read more about parsers](PASTE LINK HERE)). What it parses you may ask? Under the hood, each `Dialog` has a queue of parsers and `Dialog` takes parsers from that queue and applies to last user message until the queue is empty or parser failed to parse. In our example `locationParser` will run on initial user message.

Method `parse` is overloaded and even tho is generic, and the behavior of the function is slightly different depending on arguments. But don't worry, it's still very easy to understand.

```ts
parse<T>(parserFunc: (msg: string) -> T) -> Promise<T>
```
if you call parse with only parser function, it will just apply it to last message and return any value `parserFunc` returns.

```ts
parse<T>(parserFunc: (msg: string) -> T, errorMessage: Message) -> Promise<T>
```
if `parserFunc` returns falsy value, then `errorMessage` will be send to user and parser will stay in parsing queue untill `parserFunc` returns non-falsy value

```ts
parse<T>(
  parserObject: { parse: (msg: string) -> T, check: (parsed: T) -> boolean },
  errorMessage: Message
) -> Promise<T>
```
if `check` returns falsy value, then `errorMessage` will be send to user and parser will stay in parsing queue untill `check` returns non-falsy value

```ts
parse<T>(
  parserFunc: (msg: string) -> T,
  errorCallback: (msg: string, parsed: T) -> void
) -> Promise<T>
```
if `parserFunc` returns falsy value, then `errorCallback` will be called with message `parserFunc` tried to parse and result of parsing

```ts
parse<T>(
  parserObject: { parse: (msg: string) -> T, check: (parsed: T) -> boolean },
  errorCallback: (msg: string, parsed: T) -> void
) -> Promise<T>
```
if `check` returns falsy value, then `errorCallback` will be called with message `parserFunc` tried to parse and result of parsing


### .ask()

<!--type-->

```ts
ask(message, parser, error?) -> Promise{parsed}
```

**Arguments**

| Argument | Type                    | Description |
|:---------|:------------------------|:------------|
| message  | Bot Message             | question which will be send to user. It should have compatible type with message of derived bot. Check for message type in each bot’s docs |
|parser    | Parser                  | question which will be send to user. It should have compatible type with message of derived bot. Check for message type in each bot’s docs |
| error    | Bot Message or Callback | question which will be send to user. It should have compatible type with message of derived bot. Check for message type in each bot’s docs |

**Returns**

| Type        | Description |
|:------------|:------------|
| Bot Message | question which will be send to user. It should have compatible type with message of derived bot. Check for message type in each bot’s docs |

<!--/type-->

`ask` is a helper to get some missing information from a user and build great dialog flows. It is, in essence, a combination of `message` and` parse`. If you want to implement your own method `ask` it would look something like this:

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

Since `ask` is a combination of `message` and `parse`, its arguments are also a combination of them.
