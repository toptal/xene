import * as _ from 'lodash'

function transformer(result, value, key) {
  if (_.isPlainObject(value)) value = _.reduce(value, transformer, {})
  if (_.isArray(value)) value = value.map(snake)
  result[_.snakeCase(key)] = value
  return result
}

export function snake(object) {
  if (_.isPlainObject(object)) return _.reduce(object, transformer, {})
  return object
}
