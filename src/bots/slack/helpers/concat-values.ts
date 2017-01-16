import { isNil, concat, filter, negate } from 'lodash'

export default function concatValues<T>(...args: (T | T[])[]): T[] {
  return concat([], ...filter(args, negate(isNil)))
}
