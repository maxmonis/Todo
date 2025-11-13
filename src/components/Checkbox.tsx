import { cn } from "~/lib/utils"

interface CheckboxProps
  extends Omit<
    React.ComponentProps<"input">,
    "aria-checked" | "checked" | "onChange" | "type"
  > {
  checked: boolean
  label: string
  loading?: boolean
  onChange: () => void
}

export function Checkbox({
  checked,
  className,
  disabled,
  label,
  loading,
  onChange,
  ...props
}: CheckboxProps) {
  return (
    <label
      className={cn(
        "has-disabled:text-gray flex min-h-8 min-w-8 items-center gap-2 leading-tight has-not-disabled:cursor-pointer",
        className,
      )}
    >
      <input
        aria-checked={loading ? "mixed" : checked}
        checked={checked}
        className="h-4 w-4 not-disabled:cursor-pointer"
        disabled={disabled || loading}
        onChange={onChange}
        type="checkbox"
        {...props}
      />
      {label}
    </label>
  )
}
