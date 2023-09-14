import * as winston from 'winston'
const env = process.env.NODE_ENV || 'development'
const level = env === 'development' || process.env.XENE_LOGS_VERBOSE ? 'verbose' : 'info'

const transport = new (winston.transports.Console)({
  label: '@xene/slack',
  prettyPrint: true,
  colorize: true,
  level
})
export const logger = new (winston.Logger)({ transports: [transport] })
