import { cn } from "~/lib/dom"

export function LoadingSpinner({
  className,
  hideLoadingText,
  size = "lg",
}: {
  className?: string
  hideLoadingText?: boolean
  size?: "sm" | "lg"
}) {
  return (
    <div
      aria-live="polite"
      aria-label="Loading"
      className={cn("text-fg flex items-center justify-center", className)}
      role="status"
    >
      <span className="motion-reduce:hidden">
        <svg
          className={cn(
            "animate-spinner fill-current",
            size == "sm" ? "h-4 w-4" : "h-8 w-8",
          )}
          preserveAspectRatio="xMidYMid"
          viewBox="0 0 100 100"
        >
          <rect fill="none" height="100" width="100" x="0" y="0"></rect>
          <circle
            cx="50"
            cy="50"
            fill="none"
            r="40"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="12"
          ></circle>
        </svg>
      </span>

      {!hideLoadingText && (
        <span className="hidden motion-reduce:block">Loading...</span>
      )}
    </div>
  )
}
