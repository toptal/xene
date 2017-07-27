import * as _ from 'lodash'

export default function interpolate <T>(template: T, object: object): T {
  if (_.isPlainObject(template)) return _.mapValues(template, v => interpolate(v, object))
  if (_.isArray(template)) return (template as any).map(v => interpolate(v, object))
  if (_.isString(template)) return _.template(template)(object) as any
  return template
}
