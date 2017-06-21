import { IMessage } from '../api/types/message'

export type Handler = (context: MiddlewareContext) => void | Promise<void>
export type MiddlewareContext = {
  /**
   * Slack verification token
   */
  readonly token: string
  readonly callbackId: string
  readonly user: { id: string, name: string }
  readonly team: { id: string, domain: string }
  readonly channel: { id: string, name: string }
  readonly action: { value: string, type: 'select' | 'button', id: string }

  /**
   * Original message, all changes with this object will
   * be passed to the Slack. Assigning null or undefined
   * to this property will delete message in Slack
   * @type {IMessage}
   */
  message: IMessage

  /**
   * Ephemeral message that will be seen only by user
   * @type {string}
   */
  ephemeral: string
}
