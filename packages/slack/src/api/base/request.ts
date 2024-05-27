import * as async from 'async'
import { logger, requestToLogLevel } from '../../logger'
import { format } from 'util'

type Callback = (arg: any) => void
type Task = { uri: string, form: any, token: string, retriable: boolean, resolve: Callback, reject: Callback }
const DEFAULT_RETRY_DELAY_MS = 10 * 1000 // 10 seconds
const REQUEST_TIMEOUT = Number(process.env.XENE_REQUEST_TIMEOUT) || 0
const RETRIABLE_CODES = ['ETIMEDOUT', 'ESOCKETTIMEDOUT', 'EHOSTUNREACH', 'ECONNREFUSED']

const worker = async (task: Task, done) => {
  try {
    logger.log(requestToLogLevel, `Slack API request to: ${task.uri}`)
    const result = await postWithTimeout(task)
    task.resolve(result)
  } catch (error) {
    if (error.statusCode == 429) {
      const delayMs = (Number(error.response.headers['retry-after']) * 1000) || DEFAULT_RETRY_DELAY_MS
      logger.info(format('Slack API rate limited for %sms', delayMs))

      retryRequest(task, delayMs)
    } else if (task.retriable && error.cause && RETRIABLE_CODES.includes(error.cause.code)) {
      const delayMs = DEFAULT_RETRY_DELAY_MS
      logger.info(format('Slack API timeout: %s. Retrying in %sms', error.cause.code, delayMs))

      retryRequest(task, delayMs)
    } else {
      logger.error(error)
      logger.error(format('Slack API request errored with status %s, timeout: %s, code: %s', error.statusCode, error.timeout, error.code))
      task.reject(error)
    }
  }
  done()
}

const postWithTimeout = (task: Task) => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

  const promise = fetch(task.uri, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${task.token}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    body: task.form,
    signal: controller.signal
  })

  return promise
    .then(res => res.json())
    .finally(() => clearTimeout(timeout))
}

const retryRequest = (task: Task, delayMs: number) => {
  setTimeout(queue.resume, delayMs)
  queue.unshift(task)
  queue.pause()
}

const queue = async.queue(worker, 3)

export const request = (uri: string, form: any, token: string, retriable: boolean = false) =>
  new Promise<any>((resolve, reject) => queue.push({ uri, form, token, retriable, resolve, reject }))
