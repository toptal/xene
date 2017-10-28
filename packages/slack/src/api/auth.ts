import { APIModule } from './base'

export type Identity = {
  url: string
  team: string
  user: string
  teamId: string
  userId: string
}

export class Auth extends APIModule {
  test = (): Promise<Identity> => this.request('test')

  revoke = (test: boolean = false): Promise<{ revoked: boolean }> =>
    this.request('revoke', { test })
}
