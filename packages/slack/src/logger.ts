import * as winston from 'winston'
const env = process.env.NODE_ENV || 'development'
const level = env === 'development' || process.env.XENE_LOGS_VERBOSE ? 'verbose' : 'info'

const transport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.label({ label: '@xene/slack'}),
    winston.format.json()
  )
})
export const logger = winston.createLogger({ level, transports: [transport] })
export const requestToLogLevel = process.env.XENE_LOGS_LOG_REQUEST_TO_INFO ? 'info' : 'verbose'
