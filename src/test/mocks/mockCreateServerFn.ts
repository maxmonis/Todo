import { vi } from "vitest"

export let mockCreateServerFn = vi.fn(() => {
  let middlewares: Array<Function> = []
  let validator: { parseAsync: Function } | null = null

  return {
    handler(cb: Function) {
      return async ({
        context,
        data,
      }: { context?: unknown; data?: unknown } = {}) => {
        if (validator) data = await validator.parseAsync(data)

        for (let middleware of middlewares) context = await middleware(context)

        return cb({ context, data })
      }
    },

    inputValidator(arg: typeof validator) {
      validator = arg
      return this
    },

    middleware(arg: typeof middlewares) {
      middlewares = arg
      return this
    },
  }
})
