import { isPlainObject, isArray, mapValues, template as tpl, isString } from 'lodash'

export const interpolate = <T>(template: T, object: object): T => {
  if (isPlainObject(template)) return mapValues(template as any, v => interpolate(v, object))
  if (isArray(template)) return (template as any).map(v => interpolate(v, object))
  if (isString(template)) return tpl(template)(object) as any
  return template
}
