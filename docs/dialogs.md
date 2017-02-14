# Dialogs

## `Dialog.prototype.talk`
<types>
```ts
abstract talk() => Promise<void>
```
</types>
<!-- `talk` is called by xene bots when dialog's `match`es returns `true` or if this dialog is a default dialog.  -->

`talk` is called by xene, you don't need to call it by youself. It's like `render` function in react.js and like `render` this is a method where you will start business logic(send a message, parse, ask something). `talk` is an `async` function and xene counts dialog as active unless `talk` is resolved.

## `Dialog.prototype.message`
<types>
```ts
message(msg: Message) => Promise<void>
```
</types>
`Message` -
Send formatted messages to users and return `Promise` with result of api call.
<!-- about formatting -->

To learn more about message formatting, check [formatting spec](PASTE THE LINK).

**NOTE: `Message` is a message type defined in bot class**

## `Dialog#parse`
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

<types>
```ts
parse<T>(parserFunc: (msg: string) => T) => Promise<T>
```
if you call parse with only parser function, it will just apply it to last message and return any value `parserFunc` returns.
===
```ts
parse<T>(parserFunc: (msg: string) => T, errorMessage: Message) => Promise<T>
```
if `parserFunc` returns falsy value, then `errorMessage` will be send to user and parser will stay in parsing queue untill `parserFunc` returns non-falsy value
===
```ts
parse<T>(
  parserObject: { parse: (msg: string) => T, check: (parsed: T) => boolean },
  errorMessage: Message
) => Promise<T>
```
if `check` returns falsy value, then `errorMessage` will be send to user and parser will stay in parsing queue untill `check` returns non-falsy value
===
```ts
parse<T>(
  parserFunc: (msg: string) => T,
  errorCallback: (msg: string, parsed: T) => void
) => Promise<T>
```
if `parserFunc` returns falsy value, then `errorCallback` will be called with message `parserFunc` tried to parse and result of parsing
===
```ts
parse<T>(
  parserObject: { parse: (msg: string) => T, check: (parsed: T) => boolean },
  errorCallback: (msg: string, parsed: T) => void
) => Promise<T>
```
if `check` returns falsy value, then `errorCallback` will be called with message `parserFunc` tried to parse and result of parsing
</types>


## `Dialog#ask`
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

<types>
```ts
ask<T>(message: Message, parserFunc: (msg: string) => T) => Promise<T>
```
if `parserFunc` will return falsy value, then `message` will be send one more time untill `parserFunc` will return non-falsy value
===
```ts
ask<T>(
  message: Message,
  parserObject: { parse: (msg: string) => T, check: (parsed: T) => boolean }
) => Promise<T>
```
same as example above but parsed value will be validated with `check` instead
===
```ts
ask<T>(message: Message, parserFunc: (msg: string) => T, errorMessage: Message) => Promise<T>
```
if `parserFunc` returns falsy value, then `errorMessage` will be send to user
===
```ts
ask<T>(
  message: Message,
  parserObject: { parse: (msg: string) => T, check: (parsed: T) => boolean },
  errorMessage: Message
) => Promise<T>
```
same as [3.](#3) but return value of `check` will be checked to not be `false` instead of check for falsy return value on `parse` fucntion
===
```ts
ask<T>(
  message: Message,
  parserFunc: (msg: string) => T,
  errorCallback: (msg: string, parsed: T) => void
) => Promise<T>
```
same as [3.](#3) but instead of sending message `Bot` will call `errorCallback`
===
```ts
ask<T>(
  message: Message,
  parserObject: { parse: (msg: string) => T, check: (parsed: T) => boolean },
  errorCallback: (msg: string, parsed: T) => void
) => Promise<T>
```
same as [5.](#5) but return value of `check` will be checked
</types>
