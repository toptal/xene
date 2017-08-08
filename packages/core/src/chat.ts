import { UserMessage } from './types'

export type Action = {
  perform(msg: UserMessage): Promise<boolean>
  prepare(): any
  users: string[]
}

export class Chat {
  private actions = new Set<Action>()

  add(action: Action) {
    const canPrepare = action.users.some(u => !this.hasFor(u))
    this.actions.add(action)
    if (canPrepare) action.prepare()
  }

  prepend(action: Action) {
    this.actions = new Set([action, ...this.actions])
  }

  async processMessage(message: UserMessage) {
    const action = this.headFor(message.user)
    const canContinue = action && await action.perform(message)
    if (canContinue) this.prepareNext(action)
  }

  hasFor(user: string) {
    for (const { users } of this.actions)
      if (users.includes(user)) return true
    return false
  }

  private prepareNext(action: Action) {
    const users = action.users.reduce((acc, u) =>
      this.headFor(u) === action ? acc.concat(u) : acc, [])
    this.actions.delete(action)
    users.forEach(u => this.hasFor(u) ? this.headFor(u).prepare() : null)
  }

  private headFor(user: string) {
    for (const action of this.actions)
      if (action.users.includes(user)) return action
  }
}
