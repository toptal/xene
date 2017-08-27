import { Bot } from '@xene/core'
import { Tester } from './tester'

export const wrap = <B extends Bot>(bot: B) =>
  new Tester<B>(bot)
