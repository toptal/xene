import { Slackbot } from './slackbot'
import { camel } from './api/converters'

export default class SlackbotDispatcher {
  private bots = new Map<string, Slackbot>()

  add(id: string, bot: Slackbot) {
    this.bots.set(id, bot)
  }

  interactive = async (ctx, next: Function) => {
    const body = camel(JSON.parse(ctx.request.body.payload))
    const bot = this.bots.get(body.callbackId)
    const response = await bot.onInteractiveMessage(body)
    ctx.body = response
  }
}
