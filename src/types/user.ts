type User = {
  id: string
  email: string
  handler: string
  fullName: string
  lastName: string
  firstName: string
  [key: string]: any
}
export default User

export type SearchUser = {
  email?: string
  handler?: string
}

export type UserOption = {
  user?: User
  users?: {
    [key: string]: User
  }
}
