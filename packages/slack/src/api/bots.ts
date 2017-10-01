import { APIModule } from './base'
import { get } from '../helpers/get'

export type Bot = {
  id: string
  name: string
  appId: string
  deleted: boolean
  icons: { [key: string]: string }
}

export class Bots extends APIModule {
  info = (id: string) => this.request('info', { bot: id }).then(get<Bot>('bot'))
}
