export const isMentioned = (id: string, text: string): boolean =>
  new RegExp(id, 'i').test(text)
