import * as _ from 'lodash'
import * as uuid from 'node-uuid'
import Chat from './chat'

import Topic from './types/topic'
import Command from './types/command'
import Adapter from './types/adapter'
import { default as User, SearchUser } from './types/user'
import { default as BotMessage } from './types/messages/bot'
import { default as UserMessage } from './types/messages/user'

import SelfEmitter from './helpers/self-emitter'
import formatString from './helpers/format-string'
import strictifyMessage from './helpers/strictify-message'

export type BotOptions = {
  topics: Topic[]
  adapter: Adapter
  commands?: Command[]
}

export default class Bot extends SelfEmitter {
  public id: string
  public adapter: Adapter
  private topics: Topic[] = []
  private commands: Command[] = []
  private chats: Map<string, Chat> = new Map()

  constructor (options: BotOptions, id?: string) {
    super()
    this.id = id || uuid.v4()
    this.topics = options.topics
    this.adapter = options.adapter
    this.commands = options.commands || []
    this.pipeAdapter()
  }

  private pipeAdapter () {
    const originalEmit = this.adapter.emit
    this.adapter.emit = (event, ...args): boolean => {
      originalEmit.apply(this.adapter, [event, ...args])
      return this.emit(event, ...args)
    }
  }

  @SelfEmitter.on('message')
  private async handleMessage (message: UserMessage) {
    const chatId = message.chat
    const {text, user} = message

    this.emit('message.get', message)
    if (!this.commands || !this.topics) {
      return
    }

    const chat = this.getChat(chatId, text, user)

    if (this.isCommand(text)) {
      const command = this.parseCommand(text)
      const commandMessage = strictifyMessage(command.message, chatId)
      this.sendMessage(commandMessage)
      return this.emit(`command.${command.command}`, command)
    }

    const {done, next} = await chat.handleMessage(text)
    if (done) {
      next ? chat.setTopic(this.getTopic(next)): this.resetChat(chatId)
    }
  }

  private getChat (id: string, text: string, user: string): Chat {
    if (this.chats.has(id)) {
      return this.chats.get(id)
    }
    const chat = new Chat(id, user, this)
    chat.setTopic(this.parseTopic(text))
    this.chats.set(id, chat)
    return chat
  }

  public resetChat (id: string) {
    this.chats.delete(id)
  }

  private isCommand (message: string): boolean {
    return _.some(this.commands, c => c.matcher(message))
  }

  private parseCommand (message: string): Command {
    return _.find<Command>(this.commands, c => c.matcher(message))
  }

  private parseTopic (message: string): Topic {
    const defaultTopic = this.getTopic('default')
    const predicate = t => t.matcher && t.matcher(message)
    return this.topics.find(predicate) || defaultTopic
  }

  private getTopic (topic: string): Topic {
    return _.find(this.topics, t => t.topic === topic)
  }

  private formatMessage (message: BotMessage): BotMessage {
    const chat = this.chats.get(message.chat)
    if (!chat) { return message }
    const user = this.adapter.getUser(chat.user)
    message.text = formatString(message.text, { user })
    return message
  }

  public user (idOrKeys: string | SearchUser): User {
    return this.adapter.findUser(idOrKeys)
  }

  public sendMessage (message: BotMessage) {
    this.emit('message.send', message)
    const attachments = message.attachments
    if (attachments) {
      message.attachments = attachments.map(attachmant => {
        attachmant.callbackId = this.id
        return attachmant
      })
    }
    const formatted = this.formatMessage(message)
    this.adapter.sendMessage(formatted)
  }
}
