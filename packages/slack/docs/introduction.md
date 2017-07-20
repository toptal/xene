---
id:       introduction
category: guide

---

# Introduction

Slack module provides wrapper for Slack API and provides binding for [Bot](../../core/docs/bot.md) using Slack API so you can build your bot's much easier. Note that Slack module exports only [Slacbot](./slackbot.md) class which holds all methods to work with Slack.

To build bot using Slackbot you need to provide `botToken` and to acess powerful API methods `appToken`. You can read about that [here](https://api.slack.com/slack-apps). Once you have those tokens you can instanciate Slackbot like this:

```ts
import { Slackbot } from '@xene/slack'
const slackbot = new Slackbot({ appToken: 'xxxx', botToken: 'xxxx', dialogs: [] })
```

## Features
Slack module provides wrappers for [Slack web API](https://api.slack.com/web), [RTM API](https://api.slack.com/rtm) and simple middlware to work with [Interactive Messages](https://api.slack.com/interactive-messages) both for Koa and for Express. Slack module tries to be as close to real Slack API as possible and in the same time improve common issues. For example, all Slack API methods return camelCased, unwrapped objects.
