import type { Link } from "@tanstack/react-router";

export function MockLink({
  children,
  onClick,
  to,
  ...props
}: React.PropsWithChildren<React.ComponentProps<typeof Link>>) {
  return (
    <a
      href={to}
      onClick={(e) => {
        e.preventDefault();

        return onClick?.(e);
      }}
      {...Object.entries(props).reduce<Record<string, string>>(
        (acc, [key, value]) => {
          const newKey = ["className", "onClick", "tabIndex"].includes(key)
            ? key
            : key.toLowerCase();

          const newValue = typeof value === "boolean" ? `${value}` : value;

          acc[newKey] = newValue;

          return acc;
        },
        {},
      )}
    >
      {children}
    </a>
  );
}
