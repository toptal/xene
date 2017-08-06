import { Question } from '../question'

export class UserQueue {
  private questions = new Set<Question>()

  add(question: Question) {
    if (this.isEmpty) question.ask()
    this.questions.add(question)
  }

  get isEmpty() {
    return this.questions.size === 0
  }

  get head() {
    const iterator = this.questions.values()
    return iterator.next().value
  }

  remove(question: Question) {
    this.questions.delete(question)
  }
}
