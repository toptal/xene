import * as qs from 'qs'
import * as express from 'express'
import { IMessage } from '../api/types/message'
import * as messageFormat from '../helpers/formatters/message'
import IContext from './context'

export class SlackRequestContext implements IContext {
  message: IMessage
  callbackId: string
  action: { value: string, type: 'select' | 'button', id: string }

  constructor(payload, private req: express.Request, private res: express.Response) {
    const rowAction = payload.actions[0]
    const action: any = { type: rowAction.type, id: rowAction.name }
    if (action.type === 'button') action.value = rowAction.value
    if (action.type === 'select') action.value = rowAction.selected_options[0].value
    this.message = messageFormat.fromSlack(payload.original_message)
    this.callbackId = payload.callback_id
    this.action = action
  }

  sendStatus(status) {
    this.res.status(status).end()
  }

  replaceMessage(message: IMessage) {
    this.res.send(messageFormat.toSlack(message))
  }

  updateMessage(partial: Partial<IMessage>) {
    this.replaceMessage({ ...this.message, ...partial })
  }

  deleteMessage() {
    this.res.send({ delete_message: true })
  }
}

export function InteractiveMiddleware(requestHandler: (context: IContext) => void): express.RequestHandler {
  return function(req: express.Request, res: express.Response, next) {
    let buffer = ''
    req.on('data', chunk => buffer += chunk)
    req.on('end', async () => {
      const payload = JSON.parse(qs.parse(buffer).payload)
      const context = new SlackRequestContext(payload, req, res)
      await requestHandler(context)
      next()
    })
  }
}

export interface IInteractiveMiddlewareContext extends IContext {}
