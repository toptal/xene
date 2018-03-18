import * as Tokenizer from 'wink-tokenizer'
import * as winkStem from 'wink-porter2-stemmer'

const tokenizer = Tokenizer()
tokenizer.defineConfig({ words: true })

export const tokenize = (sentence: string): string[] =>
  tokenizer.tokenize(sentence)
    .filter(({ tag }) => tag === 'word')
    .map(({ value }) => value)

export const stem = (sentence: string): string[] =>
  tokenize(sentence).reduce((acc, t) =>
    acc.concat(winkStem(t.toLowerCase())), [])

export const uniq = <T>(arr: T[]): T[] => {
  const result: T[] = []
  for (const el of arr)
    if (!result.includes(el))
      result.push(el)
  return result
}

export const cloneArray = <T>(arr: T[]): T[] =>
  [].concat(arr)
