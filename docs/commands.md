# Commands

Commands are the way to define commands, they have higher priority over [dialogs](dialogs.md) but unlike dialogs, they don't provide `parse` and `ask` methods as dialogs and there aren't any default dialogs.

To understand how you can use them, let's take a look at the next example:

```ts
class Fibonacci extends Dialog<Consolebot> {
  static match(message: string) {
    return /fibonacci/i.test(message)
  }

  async calc(index: number): Promise<number> {
    // some fibonacci calculation...
  }

  async talk() {
    const { parse, message, calc } = this
    const nthElement = await parse<number>(numberParser, 'Please provide number of fibonacci element')
    message(`Caclulating ${nthElement}th element, please wait...`)
    const fibonacciNumber = await calc(nthElement)
    message(`${nthElement}th fibonacci element is a ${fibonacciNumber}.`)
  }
}

class Help extends Command<Consolebot> {
  static match(message: string) {
    return message.trim().toLowerCase() === 'help'
  }

  do() {
    this.message('Ask me "fibonacci for <n>" to get n-th fibonacci element')
  }
}
```

This is a pretty big example, but let's analyze what's going on. `Fibonacci` dialog will get a number and calculate Fibonacci element of that index, since for big indexes computation may take a while, actual `calc` function is implemented as an asynchronous function. Let's see how this may work.

**User**: **fibonacci for 5714320**

**Bot**: **Caclulating 5714320th element, please wait...**

**User**: *after a while, when user got bored* **help**

**Bot**: **Ask me "fibonacci for \<n\>" to get n-th fibonacci element**

**Bot**: **5714320th fibonacci element is a 7.99 * 10^1194221.**

As you can see, the dialog wasn't closed and **help** message from user didn't reach active `Fibonacci` dialog because `Help` command is higher in priority. Commands are always higher in priority and don't matter if there any active dialogs, control will be transferred to matching command.
