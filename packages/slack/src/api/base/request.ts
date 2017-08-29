import * as async from 'async'
import * as rp from 'request-promise-native'
import { logger } from '../../logger'

type Callback = (arg: any) => void
type Task = { uri: string, form: any, resolve: Callback, reject: Callback }

const worker = async (task: Task, done) => {
  try {
    await rp.post({ uri: task.uri, json: true, form: task.form }).then(task.resolve)
  } catch (error) {
    if (error.statusCode !== 429) return task.reject(error)
    const delay = Number(error.response.headers['retry-after']) * 1000
    logger.info('Slack API rate limited for %s ms', delay)
    setTimeout(queue.resume, delay)
    queue.unshift(task)
    queue.pause()
  }
  done()
}

const queue = async.queue(worker, 3)

export const request = (uri: string, form: any) =>
  new Promise<any>((resolve, reject) => queue.push({ uri, form, resolve, reject }))
