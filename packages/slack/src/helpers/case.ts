import { isObject, isArray, camelCase, snakeCase, reduce } from 'lodash'

const transformer = f => (acc, value, key) => {
  if (isArray(value)) value = value.map(traverse(f))
  else if (isObject(value)) value = reduce(value, transformer(f), {})
  acc[f(key)] = value
  return acc
}

const traverse = f => value => {
  if (isArray(value)) return value.map(traverse(f))
  if (isObject(value)) return reduce(value, transformer(f), {})
  return value
}

export const camel = traverse(camelCase)
export const snake = traverse(snakeCase)
