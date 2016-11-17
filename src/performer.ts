import * as _ from 'lodash'
import User from './types/user'
import Query from './queries/query'
import Scenario from './types/scenario'

class ArgumentError extends Error {}

export default class Performer {
  private user: User
  private namedUsers: {[key: string]: User}
  private state: Object = {}
  private query: Query
  private queries: Query[]

  // TODO accept only queries. only that matters
  constructor (scenario: Scenario, user: string | {[name: string]: string}) {
    this.queries = scenario.queries.map(q => q())
    this.query = _.head(this.queries)
    this.loadUsers(user)
  }

  public async input (text: string): Promise<boolean>  {
    // TODO set next scenario right here, but we need the Bot
    // throw an error instead of returning error
    return {}
  }

  private loadUsers (user: string | {[name: string]: string}) {

  }
}
