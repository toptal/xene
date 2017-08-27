export type UserMessage = { id: string, text: string, chat: string, user: string }
export type ParseFun<T> = (reply: string) => T
export type ParseObj<T> = { parse: ParseFun<T>, isValid(parsed: T): boolean }
export type ParseType<T> = ParseFun<T> | ParseObj<T>
