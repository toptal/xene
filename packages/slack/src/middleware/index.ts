import * as http from 'http'
import { Handler } from './types'
import { express, koa } from './middlewares'

const check = (a, b, c) =>
  a instanceof http['IncomingMessage'] && // tslint:disable-line
  b instanceof http['ServerResponse'] && // tslint:disable-line
  typeof c === 'function'

const isKoa = (args: any[]) => check(args[0].req, args[0].res, args[1])
const isExpress = (args: any[]) => check(args[0], args[1], args[2])

export default (handler: Handler) => (...args) => {
  if (isExpress(args)) return express(handler, args[0], args[1], args[2])
  else if (isKoa(args)) return koa(handler, args[0], args[1])
  else throw new Error('Slack middleware supports only koa >= 2 and express >= 4.')
}
