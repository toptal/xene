---
id:       bots
prev:     parsers
category: guide

---

# Bots

Xene is ultimate bot framework which means that it provides ways to use to create different bots(for Slack, for Skype or even for your SPA react app) with same techs. To give you that freedom, xene provides bot classes for different classes.

Currently implemented bot:
- [Slackbot](PASTE LINK HERE)
- [Consolebot](PASTE LINK HERE)

## What they have in common?

All xene bots are subclasses of generic abstract `Bot` class and all they have common methods:

```ts
abstract class Bot<Message, User extends {id: string}> {
  abstract getUser(id: string): Promise<User>
  abstract sendMessage(chat: string, message: Message): Promise<any>
  abstract formatMessage(message: Message, object: any): Message
}
```

As you already may notice concrete bot classes should define types of their `Message` and `User` objects which then should be accepted in required methods of concrete bot classes. For `Consolebot`, for example, `Message` is defined as just a `string`, which means all methods shown should work with `strings` as `Message`. So for `Consolebot` methods which work with `Message` look like this:

```ts
class Consolebot extends Bot<string, User> {
  sendMessage(chat: string, message: string): Promise<any>
  formatMessage(message: string, object: any): string
}
```

_TIP: For more details about `Message` and `User` types for each bot check out their own docs from the link above._

## What's the difference?

Except the common methods we described a bit earlier each concrete bot may define their own useful methods. For example `Slackbot` defines methods to manage Slack OAuth 2 flow and a lot of methods specific to Slack API.

## What else we can do with bot

The good part of the bot class is that its instance is available in every `Dialog` and `Command`. When bot instantiates your `Dialog` class, it also assigns himself to its `bot` property. And inside of `Dialog` class, you can call methods of your bot (this is exactly how [`Dialog#message`](dialogs.md#dialogmessage) is implemented, it calls bot's `sendMessage` and `formatMessage` methods).

But this availability of `Bot` classes instances is more powerful and a good place to define your own specific methods and properties. Let's take a look at the example to understand this concept:

```ts
class Destroyer extends Slackbot {
  leaveChannel(channel: string) {
    // . . .
  }
}

// And in your Command
class Leave extends Command<Destroyer> {
  static match(message: string) {
    message.trim().toLowerCase() === 'go away'
  }

  do() {
    this.bot.leaveChannel(this.chat)
  }
}
```

In the example above we defined a method in our own subclass of `Slackbot` and used it to implement `Leave` command.
