import { vi } from "vitest"

export let mockCreateServerFn = vi.fn(() => {
  let validator: { parseAsync: Function } | null = null
  let middlewares: Array<Function> = []

  return {
    handler(cb: Function) {
      return async ({
        data,
        context,
      }: { data?: unknown; context?: unknown } = {}) => {
        if (validator) data = await validator.parseAsync(data)

        for (let middleware of middlewares) context = await middleware(context)

        return cb({ context, data })
      }
    },

    inputValidator(arg: { parseAsync: Function }) {
      validator = arg
      return this
    },

    middleware(arg: Array<Function>) {
      middlewares = arg
      return this
    },
  }
})
