---
id:       command
prev:     dialog
category: reference

---

# Command

<!--intro-->
One Commnd to rule them all...
<!--/intro-->

Command are the way to define higher in priority operations than [Dialogs](/dialog.md) that can even interupt Dialogs. For example to show a help message during an active dialog or even stop an active dialog. 

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
    this.stopDialog()
    await this.message('OK boss!')
  }
}
```

<!-- TODO -->

## Command's Lifecycle

Command's lifecycle can be split to three parts: when it matches, when it's created and when it's active.

- [`static match()`](#static-match) is called every time bot recieves new message from user even if user has active dialog with the bot.
- [`constructor()`](#constructor)
- [`perform()`](#constructor)

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

Very rarely you'll have to override constructor since both `bot` and `chat` are available as properties of the dialog.

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

All business logic of the Commads are located here.
<!-- TODO -->
