import * as Koa from 'koa'
import * as qs from 'querystring'
import * as Express from 'express'
import * as rawBody from 'raw-body'
import * as request from 'request-promise-native'
import { get, isString, isEqual } from 'lodash'

import { camel } from '../api/converters'
import * as format from '../helpers/formatters/message'
import { MiddlewareContext, MiddlewareHandler } from '../types'

const streamPayload = request => rawBody(request, { encoding: true }).then(qs.parse).then(i => JSON.parse(i.payload))
const existingPayload = payload => typeof payload === 'string' ? JSON.parse(payload) : payload

const middlewareContext = (payload): MiddlewareContext => {
  const action = payload.actions[0]
  const { user, team, channel, token, callbackId, responseUrl } = payload
  return {
    user, team, channel, token, callbackId, ephemeral: undefined, responseUrl,
    message: format.fromSlack(payload.originalMessage),
    action: {
      value: action.type === 'button' ? action.value : action.selectedOptions[0].value,
      type: action.type,
      id: action.name
    }
  }
}

const processRequestWithHandler = async (handler: MiddlewareHandler, payload) => {
  const context = middlewareContext(camel(payload))
  await handler(context)

  let response
  const { ephemeral, message } = context
  const ephemeralAdded = ephemeral != null
  const messageDeleted = message == null
  const messageChanged = !messageDeleted && !isEqual(message, format.fromSlack(payload.original_message))

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

  const body = response || payload.original_message
  request.post({ uri: context.responseUrl, body, json: true })
}

export const koa = async (handler: MiddlewareHandler, ctx: Koa.Context, next) => {
  if (ctx.method.toLowerCase() !== 'post') return
  // ctx.request.body hack is to get parsed body
  // if any body parsers middleware is already used in code
  // tslint:disable
  const payload = existingPayload(get(ctx, 'request.body.payload')) || await streamPayload(ctx.req)
  processRequestWithHandler(handler, payload)
  ctx.body = payload.original_message
  ctx.status = 200
  return next()
}

export const express = async (handler: MiddlewareHandler, req: Express.Request, res: Express.Response, next) => {
  if (req.method.toLowerCase() !== 'post') return
  const payload = existingPayload(get(req, 'body.payload')) || await streamPayload(req)
  processRequestWithHandler(handler, payload)
  res.status(200).end()
  return next()
}
