import * as Koa from 'koa'
import * as Express from 'express'
import * as qs from 'querystring'
import * as rawBody from 'raw-body'
import { get, isString, isEqual } from 'lodash'

import camelize from '../api/converters/camel'
import { Message } from '../api/types/message'
import * as format from '../helpers/formatters/message'
import { Handler, MiddlewareContext } from './types'

const streamPayload = request => rawBody(request, { encoding: true }).then(qs.parse).then(i => JSON.parse(i.payload))
const existingPayload = payload => typeof payload === 'string' ? JSON.parse(payload) : payload

const middlewareContext = (payload): MiddlewareContext => {
  const action = payload.actions[0]
  const { user, team, channel, token, callbackId } = payload
  return {
    user, team, channel, token, callbackId, ephemeral: undefined,
    message: format.fromSlack(payload.originalMessage),
    action: {
      value: action.type === 'button' ? action.value : action.selectedOptions[0].value,
      type: action.type,
      id: action.name
    }
  }
}

const getResponse = async (handler: Handler, payload) => {
  const context = middlewareContext(payload)
  await handler(context)

  let response
  const { ephemeral, message } = context
  const ephemeralAdded = ephemeral != null
  const messageDeleted = message == null
  const messageChanged = !messageDeleted && !isEqual(message, format.fromSlack(payload.originalMessage))

  if (ephemeralAdded && messageChanged)
    throw new Error("Can't show ephemeral message and update original message in the same time.")

  if (messageChanged) response = format.toSlack(message)
  if (messageDeleted) response = { delete_original: true }
  if (ephemeralAdded) {
    response = isString(ephemeral) ? { text: ephemeral } : format.toSlack(ephemeral)
    response.response_type = 'ephemeral'
    response.replace_original = false
    response.delete_original = messageDeleted
  }

  return response
}

export const koa = async (handler: Handler, ctx: Koa.Context, next) => {
  if (ctx.method.toLowerCase() !== 'post') return
  // ctx.request.body hack is to get parsed body
  // if any body parsers middleware is already used in code
  // tslint:disable
  const payload = existingPayload(get(ctx, 'request.body.payload')) || await streamPayload(ctx.req)
  const body = await getResponse(handler, camelize(payload))
  ctx.body = body || payload.original_message
  ctx.status = 200
  return next()
}

export const express = async (handler: Handler, req: Express.Request, res: Express.Response, next) => {
  if (req.method.toLowerCase() !== 'post') return
  const payload = existingPayload(get(req, 'body.payload')) || await streamPayload(req)
  const body = await getResponse(handler, camelize(payload))
  body ? res.send(body) : res.status(200).end()
  return next()
}
