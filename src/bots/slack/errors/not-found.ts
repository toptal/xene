import { capitalize } from 'lodash'
import ClientError from './error'

export default class NotFound extends ClientError {
  constructor(type: string, args: any) {
    super(`${capitalize(type)} isn't found with params: ${JSON.stringify(args)}`)
  }
}
