import * as _ from 'lodash'

function transformer (result, value, key) {
  if (_.isPlainObject(value)) value = _.reduce(value, transformer, {})
  if (_.isArray(value)) value = value.map(camelObject)
  result[_.camelCase(key)] = value
  return result
}

export default function camelObject (object) {
  return _.reduce(object, transformer, {})
}
