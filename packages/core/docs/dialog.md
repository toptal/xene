---
id:       dialog
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

<!-- api:core:dialog -->
