import ClientError from './error'

export default class APIError extends ClientError {
  constructor(message: string) {
    super(`Slack API returned error code ${message}.`)
  }
}
