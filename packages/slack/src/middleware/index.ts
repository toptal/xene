import * as qs from 'qs'
import * as express from 'express'
import { IMessage } from '../api/types/message'
import * as messageFormat from '../helpers/formatters/message'
import IContext from './context'

export class SlackRequestContext implements IContext {
  user: string
  token: string
  channel: string
  message: IMessage
  callbackId: string
  action: { value: string, type: 'select' | 'button', id: string }
  responseUrl: string

  constructor(payload, private req: express.Request, private res: express.Response) {
    const rowAction = payload.actions[0]
    const action: any = { type: rowAction.type, id: rowAction.name }
    if (action.type === 'button') action.value = rowAction.value
    if (action.type === 'select') action.value = rowAction.selected_options[0].value
    this.message = messageFormat.fromSlack(payload.original_message)
    this.responseUrl = payload.response_url
    this.callbackId = payload.callback_id
    this.channel = payload.channel.id
    this.action = action
    this.token = payload.token
    this.user = payload.user.id
  }

  sendStatus(status: number) {
    this.res.status(200).end()
  }

  sendError(text: string) {
    this.res.setHeader('Content-Type', 'application/json')
    this.res.status(200).end(JSON.stringify({
      response_type: "ephemeral",
      replace_original: false,
      text
    }))
  }

  replaceMessage(message: IMessage) {
    this.res.send(messageFormat.toSlack(message))
  }

  updateMessage(partial: Partial<IMessage>) {
    this.replaceMessage({ ...this.message, ...partial })
  }

  deleteMessage() {
    this.res.send({ delete_original: true })
  }
}

export function InteractiveMiddleware(requestHandler: (context: IContext) => void): express.RequestHandler {
  return async function(req: express.Request, res: express.Response, next) {
    let buffer = req.body || ''
    // body can be parsed by body-parser like middleware
    if (buffer) {
      const context = new SlackRequestContext(JSON.parse(buffer.payload), req, res)
      await requestHandler(context)
      return next()
    }
    req.on('data', chunk => buffer += chunk)
    req.on('end', async () => {
      const payload = JSON.parse(qs.parse(buffer).payload)
      const context = new SlackRequestContext(payload, req, res)
      await requestHandler(context)
      next()
    })
  }
}

export interface InteractiveRequestContext extends IContext {}
