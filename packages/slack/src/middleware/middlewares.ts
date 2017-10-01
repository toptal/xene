import * as Koa from 'koa'
import * as qs from 'querystring'
import * as Express from 'express'
import * as rawBody from 'raw-body'
import * as request from 'request-promise-native'
import { get, isString, isEqual } from 'lodash'

import { camel } from '../helpers/case'
import * as format from '../helpers/formatters/message'
import { MiddlewareContext, MiddlewareHandler } from '../types'

const streamPayload = req => rawBody(req, { encoding: true }).then(qs.parse).then(i => JSON.parse(i.payload))
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
  const deleted = message == null
  const modified = !deleted && !isEqual(message, format.fromSlack(payload.original_message))

  if (ephemeralAdded && modified)
    throw new Error("Can't show ephemeral message and update original message in the same time.")

  if (modified) response = format.toSlack(message)
  if (deleted) response = { delete_original: true }
  if (ephemeralAdded) {
    response = isString(ephemeral) ? { text: ephemeral } : format.toSlack(ephemeral)
    response.response_type = 'ephemeral'
    response.replace_original = false
    response.delete_original = deleted
  }

  if (!modified && !deleted && !ephemeralAdded) return
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
  ctx.status = 200
  ctx.body = ''
  return next()
}

export const express = async (handler: MiddlewareHandler, req: Express.Request, res: Express.Response, next) => {
  if (req.method.toLowerCase() !== 'post') return
  const payload = existingPayload(get(req, 'body.payload')) || await streamPayload(req)
  processRequestWithHandler(handler, payload)
  res.status(200).end()
  return next()
}
