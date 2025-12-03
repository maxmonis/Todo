import { vi } from "vitest";

interface Ctx {
  context?: unknown;
  data?: unknown;
}

export const mockCreateServerFn = vi.fn(() => {
  let middlewares: Array<(context: unknown) => unknown> = [];
  let validator: {
    parseAsync: (data: unknown) => unknown;
  } | null = null;

  return {
    handler(cb: (ctx: Ctx) => unknown) {
      return async ({ context, data }: Ctx = {}) => {
        if (validator) {
          data = await validator.parseAsync(data);
        }

        for (const middleware of middlewares) {
          context = await middleware(context);
        }

        return cb({
          context,
          data,
        });
      };
    },

    inputValidator(arg: typeof validator) {
      validator = arg;
      return this;
    },

    middleware(arg: typeof middlewares) {
      middlewares = arg;
      return this;
    },
  };
});
