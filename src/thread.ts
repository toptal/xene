import * as _ from 'lodash'
import User from './types/user'
import Topic from './types/topic'
import Query from './queries/query'

const isUser = (obj: User | {[name: string]: User}): obj is User =>
  _.every(obj, _.isObject)

export default class Thread {
  private user: User
  private users: {[name: string]: User}
  private state: Object = {}
  private query: Query
  private queries: Query[]

  constructor (topic: Topic, user: User | {[name: string]: User}) {
    this.queries = topic.queries.map(q => q())
    this.query = _.head(this.queries)
    if (isUser(user)) {
      this.user = user
    } else {
      this.users = user
    }
  }


}
