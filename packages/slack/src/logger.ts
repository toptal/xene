import * as winston from 'winston'
const env = process.env.NODE_ENV || 'development'
const level = env === 'development' ? 'verbose' : 'info'

const transport = new (winston.transports.Console)({
  label: '@xene/slack',
  prettyPrint: true,
  colorize: true,
  level
})
export default new (winston.Logger)({ transports: [transport ] })
