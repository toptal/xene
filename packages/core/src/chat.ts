import { UserMessage } from './types'

export interface IManager {
  perform(msg: UserMessage): Promise<boolean>
  prepare(): any
  users: string[]
}

export class Chat {
  private managers = new Set<IManager>()

  add(manager: IManager) {
    const canPrepare = manager.users.some(u => !this.hasFor(u))
    this.managers.add(manager)
    if (canPrepare) manager.prepare()
  }

  async processMessage(message: UserMessage) {
    const manager = this.headFor(message.user)
    const canContinue = manager && await manager.perform(message)
    if (canContinue) this.prepareNext(manager)
  }

  hasFor(user: string) {
    for (const { users } of this.managers)
      if (users.includes(user)) return true
    return false
  }

  private prepareNext(manager: IManager) {
    const users = manager.users.reduce((acc, u) =>
      this.headFor(u) === manager ? acc.concat(u) : acc, [])
    this.managers.delete(manager)
    users.forEach(u => this.hasFor(u) ? this.headFor(u).prepare() : null)
  }

  private headFor(user: string) {
    for (const manager of this.managers)
      if (manager.users.includes(user)) return manager
  }
}
