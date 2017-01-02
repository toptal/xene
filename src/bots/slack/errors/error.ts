export default class ClientError extends Error {
  constructor(public message: string) {
    super()
    this.name = 'SlackbotApiError'
  }
}
