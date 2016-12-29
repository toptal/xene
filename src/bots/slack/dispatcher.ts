import Slackbot from './bot'

export default class SlackBotDispatcher {
  private bots = new Map<string, Slackbot>()
  constructor() {
    this.interactive = this.interactive.bind(this)
  }

  add(id: string, bot: Slackbot) {
    this.bots.set(id, bot)
  }

  interactive(req, res) {
    const body = JSON.parse(req.body.payload)
    const bot = this.bots.get(body.callback_id)
    const response = bot.onInteractiveMessage(body)
    res.send(response)
  }
}
