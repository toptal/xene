import * as request from 'request-promise-native'

let queue = Promise.resolve()
const resolveInQueue = (cb) => queue = queue.then(cb)
const pause = (ms: number) => resolveInQueue(() => new Promise(r => setTimeout(r, ms)))

const post = (uri: string, form: any) => request.post({ uri, json: true, form })
const queuedPost = (uri: string, form: any) => new Promise(resolveInQueue).then(() => post(uri, form))

export default function requestWithRatelimit(uri: string, form: any) {
  return queuedPost(uri, form).catch(error => {
    if (error.statusCode !== 429) throw error
    pause(Number(error.response.headers['retry-after']) * 1000)
    return requestWithRatelimit(uri, form)
  })
}
