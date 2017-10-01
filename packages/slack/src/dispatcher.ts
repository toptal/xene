import { Slackbot } from './slackbot'
import { camel } from './helpers/case'

export class SlackbotDispatcher {
  private bots = new Map<string, Slackbot>()

  add(id: string, bot: Slackbot) {
    this.bots.set(id, bot)
  }

  interactive = async (ctx, next: any) => {
    const body = camel(JSON.parse(ctx.request.body.payload))
    const bot = this.bots.get(body.callbackId)
    const response = await bot.onInteractiveMessage(body)
    ctx.body = response
  }
}
