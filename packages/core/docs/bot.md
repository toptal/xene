---
id:       bot
category: reference

---

# Bot

## Reference

### .constructor()
<!--type-->
```ts
constructor(options) -> bot
```

**Arguments**

| Argument | Type   | Description    |
|:---------|:-------|:---------------|
| options  | { dialogs: Dialog[], commands: Command[]} | options is an object with with `dialogs` and `commands` keys. Please note that `Bot` expects arrays of classes of `Dialogs` and `Commands`, not instances. |

**Returns**

| Type    | Description                                       |
|:--------|:--------------------------------------------------|
| Bot | instance of the Bot |
<!--/type-->

Simple example of usage is demonstrated below.

```ts
import { Bot, Dialog, Command } from '@xene/core'

class OwnDialog extends Dialog { /* ... */ }
class OwnCommand extends Command { /* ... */ }

const bot = new Bot({ dialogs: [OwnDialog], commands: [OwnCommand] })
```

