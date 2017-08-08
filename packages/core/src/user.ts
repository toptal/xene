import { Question } from './question'

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

// bot -> chats -> users -> actions - dialogs
/**
 * on add -> if there are actions for user, add action to bottom and don't do anything
 *        -> otherwise execute action
 * chat keeps list of actions with users to which they are applicable to
 *
 * dialog pushes action to its chat
 *
 * chat call action and if it returns true, moves to next action for user
 *
 * when action is called its dialog resolves parser for that dialog if succeeds then moves to next
 * if next is parser, try to parse when next is a question or null, returns true, otherwise executes onerror and returns false
 */
