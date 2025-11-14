import { cn } from "~/lib/utils"

interface LoadingSpinnerProps {
  className?: string
  hideLoadingText?: boolean
}

export function LoadingSpinner({
  className,
  hideLoadingText,
}: LoadingSpinnerProps) {
  return (
    <div
      aria-live="polite"
      aria-label="Loading"
      className={cn("text-fg flex items-center justify-center", className)}
      role="status"
    >
      <span className="motion-reduce:hidden">
        <svg
          className="h-8 w-8 animate-spinner fill-current"
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
