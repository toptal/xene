---
id:       command
prev:     dialog
category: reference

---

# Command

<!--intro-->
Key to control conversations.
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

<!-- api:core:command -->
