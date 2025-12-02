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
        // prevent navigation but ensure click handler called
        e.preventDefault();
        return onClick?.(e);
      }}
      {...Object.entries(props).reduce<Record<string, string>>(
        (acc, [key, value]) => {
          // prevent warnings about invalid DOM attributes
          const newKey = ["className", "onClick", "tabIndex"].includes(key)
            ? key
            : key.toLowerCase();

          // prevent warnings about non-boolean attributes
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
