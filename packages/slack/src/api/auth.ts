import { APIModule } from './base'

export type Identity = {
  url: string
  team: string
  user: string
  teamId: string
  userId: string
}

export class Auth extends APIModule {
  protected get token() {
    if (typeof this.tokens === 'string') return this.tokens
    return this.tokens.botToken || this.tokens.appToken
  }

  test = (): Promise<Identity> => this.request('test')

  revoke = (test: boolean = false): Promise<{ revoked: boolean }> =>
    this.request('revoke', { test })
}
