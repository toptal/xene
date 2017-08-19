import { UserMessage } from './types'

export interface IManager {
  users: string[]
  prepare(): any
  perform(msg: UserMessage): Promise<boolean>
}

const remove = <T>(array: T[], el: T): T[] => {
  const index = array.indexOf(el)
  return index >= 0 ? array.splice(index, 1) : array
}

export class Chat {
  private _managers: IManager[] = []

  add(manager: IManager) {
    const canPrepare = manager.users.some(u => !this.hasFor(u))
    this._managers.push(manager)
    if (canPrepare) manager.prepare()
  }

  processMessage(message: UserMessage) {
    const manager = this._headFor(message.user)
    const canContinue = manager && manager.perform(message)
    if (canContinue) this._prepareNext(manager)
  }

  hasFor(user: string) {
    for (const { users } of this._managers)
      if (users.includes(user)) return true
    return false
  }

  private _prepareNext(manager: IManager) {
    const users = manager.users.reduce((acc, u) =>
      this._headFor(u) === manager ? acc.concat(u) : acc, [])

    remove(this._managers, manager)
    users.forEach(u => this.hasFor(u) ? this._headFor(u).prepare() : null)
  }

  private _headFor(user: string) {
    for (const manager of this._managers)
      if (manager.users.includes(user)) return manager
  }
}
