import * as _ from 'lodash'
const regex = /{([^{}]+?)}/g

export default function format (string: string, obj: any) {
  const replacer = (matched, path) => _.get(obj, path.trim(), matched)
  return string.replace(regex, replacer)
}
