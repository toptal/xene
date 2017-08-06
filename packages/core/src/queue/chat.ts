import { UserMessage } from '../types'
import { Question } from '../question'
import { UserQueue } from './user'

export class ChatQueue {
  private usersQueues = new Map<string, UserQueue>()

  add(question: Question, users: string[]) {
    users.forEach(u => {
      const queue = this.queueFor(u)
      if (queue.isEmpty) question.ask()
      queue.add(question)
    })
  }

  async processMessage(message: UserMessage) {
    const question = this.queueFor(message.user).head
    if (!question) return
    const success = await question.tryToParse(message)
    if (success) this.nextQuestion(question)
  }

  queueFor(user: string) {
    const queues = this.usersQueues.get(user) || new UserQueue()
    this.usersQueues.set(user, queues)
    return queues
  }

  private nextQuestion(previous: Question) {
    for (const queue of this.usersQueues.values()) {
      const head = queue.head
      queue.remove(previous)
      if (head === previous && queue.head)
        queue.head.ask()
    }
  }

}
