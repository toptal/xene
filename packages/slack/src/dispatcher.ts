import Slackbot from './bot'
import camelize from './api/converters/camel'

export default class SlackbotDispatcher {
  private bots = new Map<string, Slackbot>()

  add(id: string, bot: Slackbot) {
    this.bots.set(id, bot)
  }

  interactive = (req, res) => {
    const body = camelize(JSON.parse(req.body.payload))
    const bot = this.bots.get(body.callbackId)
    const response = bot.onInteractiveMessage(body)
    res.send(response)
  }
}
