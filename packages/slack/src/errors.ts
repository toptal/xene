// tslint:disable:max-classes-per-file
import { capitalize } from 'lodash'

export class ClientError extends Error {
  constructor(public message: string) {
    super()
    this.name = 'SlackbotApiError'
  }
}

export class NotFound extends ClientError {
  constructor(type: string, args: any) {
    super(`${capitalize(type)} isn't found with params: ${JSON.stringify(args)}`)
  }
}

export class APIError extends ClientError {
  constructor(message: string) {
    super(`Slack API returned error code ${message}.`)
  }
}
