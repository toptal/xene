import * as _ from 'lodash'

function transformer (result, value, key) {
  if (_.isPlainObject(value)) value = _.reduce(value, transformer, {})
  if (_.isArray(value)) value = value.map(snakeObject)
  result[_.snakeCase(key)] = value
  return result
}

export default function snakeObject(object) {
  return _.reduce(object, transformer, {})
}
