export default (id: string, text: string): boolean => {
  const idrx = new RegExp(id, 'i')
  return idrx.test(text)
}
