import { isString } from 'lodash'
import { Bot } from '@xene/core'

import { middleware } from './middleware'
import { isMentioned } from './helpers/is-mentioned'
import { isPrivateChannel } from './helpers/channel-type'

import { User, Message, MiddlewareContext } from './types'
import { Oauth, Auth, RTM, Chat, Users, Groups, Channels, Files } from './api'



import { App } from '@slack/bolt';
import { UsersBolt } from './api'

import { logger } from './logger'

import {
  GenericMessageEvent,
  MessageEvent,
  ReactionAddedEvent,
  ReactionMessageItem
} from '@slack/bolt';

export interface SlackServiceOptions {
  botToken: string,
  signingSecret: string
  appToken: string
}

export class SlackbotBolt extends Bot<string | Message> {
  static Oauth = Oauth

  // FIXME: Do we need it?
  // static dispatch = (ctx: MiddlewareContext) => {
  //   const { team, action, channel: { id: channel }, user: { id: user } } = ctx
  //   const slackbot = SlackbotBolt.bots.find(b => b.self.team.id === team.id)
  //   const selectedReplacer = `*:white_check_mark: ${action.value}*`
  //   ctx.message.attachments!.forEach(a => {
  //     if (!a.menus.some(m => m.id === action.id) &&
  //       !a.buttons.some(m => m.id === action.id)) return
  //     a.text = a.text ? `${a.text}\n${selectedReplacer}` : selectedReplacer
  //     a.menus = []
  //   })
  //   slackbot.onMessage({ id: Date.now().toString(), channel, text: action.value, user })
  // }

  // tslint:disable-next-line:member-ordering
  // static middleware = middleware(Slackbot.dispatch)
  private static bots: SlackbotBolt[] = []

  self: {
    id: string, name: string
    team: { id?: string, title: string }
  }

  // API Modules
  users = UsersBolt.prototype
  app: App

  constructor(options: SlackServiceOptions) {
    super()
    logger.info('Creating SlackbotBolt', options)
    this.app = new App({
      token: options.botToken,
      signingSecret: options.signingSecret,
      appToken: options.appToken,
      socketMode: true,
      // developerMode: true,
    });
    this.users = new UsersBolt(this.app)
  }

  async say(channel: string, message: string | Message) {
    const init = { text: '', attachments: [] }
    message = isString(message) ? { ...init, text: message } : { ...init, ...message }

    return this.app.client.chat.postMessage({ channel: channel, ...message })
  }

  /**
   * Connect to Slack Events API via Socket Mode
   */
  listen() {
    logger.info('Listening to Slack Events')

    this.app.message(async ({ message, say }) => {
      if (!isGenericMessageEvent(message)) return;
      logger.info("Received a generic message event", message.text)
      this.onMessage({ id: message.ts, text: message.text, user: message.user, channel: message.channel })
    });

    this.app.event('app_mention', async ({ event, message, say }) => {
      logger.info("Received an app mention event", event.text)
      this.onMessage({ id: event.ts, text: event.text, user: event.user, channel: event.channel })
    });

    this.app.start(3000).then(() => {
      logger.info('⚡️ Bolt app is running!')
    })
    return this
  }

  // FIXME: This is not used and may not be needed
  private async selfIdentify() {
    logger.info('selfIdentify')
    const { team, teamId, user, userId } = await this.app.client.auth.test()
    // FIXME: teamId could not be available in the response
    this.self = { id: 'id', name: user, team: { id: "teamId", title: team } }
  }
}

// Used to filter out messages that are not from users
// More context https://github.com/slackapi/bolt-js/issues/904#issuecomment-1983078026
export const isGenericMessageEvent = (msg: MessageEvent): msg is GenericMessageEvent => {
  return (msg as GenericMessageEvent).subtype === undefined;
}