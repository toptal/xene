---
id:       command
prev:     dialog
category: reference

---

# Command

<!--intro-->
One Commnd to rule them all...
<!--/intro-->

Command are the way to define higher in priority operations than [Dialogs](/dialog.md) that can even interupt Dialogs. For example to show a help message during an active dialog or stop an active dialog.

Let's take a look at the example that illustrates how Commands can be used to stop active Dialog.

```ts
class Fibonacci extends Dialog {
  static match(message) { return /fibonacci/i.test(message) }

  async calc(index) { /* some fibonacci calculation logic */ }

  async talk() {
    const { parse, message, calc } = this
    const nthElement = await parse(numberParser, 'Please provide number of fibonacci element')
    message(`Caclulating ${nthElement}th element, please wait...`)
    const fibonacciNumber = await calc(nthElement)
    message(`${nthElement}th fibonacci element is a ${fibonacciNumber}.`)
  }
}

class Stop extends Command {
  static match(message) { return message.toLowerCase() === 'stop' }

  async perform() {
    this.bot.stopDialog(this.chat, this.user)
    await this.message('OK boss!')
  }
}
```

## Command's Lifecycle

Command's lifecycle can be split to three parts: when it matches, when it's created and when it's active.

- [`static match()`](#static-match) is called every time bot recieves new message from user even if user has active dialog with the bot.
- [`constructor()`](#constructor) called when `match()` returns `true`
- [`perform()`](#constructor) called right after instantiation of the Command

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
| Boolean | indicates if the `message` a start of the Command |
<!--/type-->

Method `match()` is used by xene to match user's messages with predefined Commands. It's called no matter what — user does or doesn't have active dialog with the bot.

### .constructor()
<!--type-->
```ts
constructor(bot, chat) -> Command
```

**Arguments**

| Argument | Type   | Description                                              |
|:---------|:-------|:---------------------------------------------------------|
| bot      | Bot    | instance of the xene bot to which the Command belongs to |
| chat     | String | a chat id                                                |

**Returns**

| Type    | Description                |
|:--------|:---------------------------|
| Command | an instance of the Command |
<!--/type-->

Very rarely you'll have to override constructor since both `bot` and `chat` are available as properties of the Command.

### .perform()
<!--type-->
```ts
perform() -> Promise{void}
```

**Returns**

| Type    | Description             |
|:--------|:------------------------|
| Promise | empty awaitable promise |
<!--/type-->

`perform()` is called by xene once command is instantiated. It's the main place to perform operations.


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
class Help extends Command {
  static match(msg) { return /help/i.test(msg) }

  async talk() {
    await this.message('Help yourself 😼')
  }
}
```

**NOTE: `Message` is a message type defined in bot class**
