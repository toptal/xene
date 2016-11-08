import {EventEmitter} from 'events'

declare module '@slack/client' {
  interface Chat {
    postMessage(channel: string, text: string, options?: { attachments: any }) : Promise<any>
  }
  export class RtmClient extends EventEmitter {
    constructor(token: string, options?: any)
    start(): void
    dataStore: any
  }

  export class WebClient {
    constructor(token: string, options?: any)
    chat: Chat
  }

  export class IncomingWebhook {}
  export var RTM_EVENTS: any
  export var RTM_MESSAGE_SUBTYPES: any
  export var MemoryDataStore: any
  export var CLIENT_EVENTS: any
}
