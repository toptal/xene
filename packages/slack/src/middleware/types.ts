export type Handler = (context: MiddlewareContext) => void | Promise<void>

export abstract class MiddlewareContext {

}
