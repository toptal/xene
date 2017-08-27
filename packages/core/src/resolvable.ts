export class Resolvable<T> {
  reject: (error?: Error | any) => void
  resolve: (arg: T) => void
  promise: Promise<T>

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }
}
