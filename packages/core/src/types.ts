export type UserMessage<T extends { id: string }> = {
  id: string | number, text: string, user: T, chat: string
}
export type BaseUser = { id: string }
