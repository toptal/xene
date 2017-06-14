import Slackbot from './bot'
import camelize from './api/converters/camel'

export default class SlackbotDispatcher {
  private bots = new Map<string, Slackbot>()

  add(id: string, bot: Slackbot) {
    this.bots.set(id, bot)
  }

  interactive = async (ctx, next: Function) => {
    const body = camelize(JSON.parse(ctx.request.body.payload))
    const bot = this.bots.get(body.callbackId)
    const response = await bot.onInteractiveMessage(body)
    ctx.body = response
  }
}
