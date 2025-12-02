interface Props {
  error: unknown;
  reset: () => void;
}

export function ErrorComponent({ error, reset }: Props) {
  return (
    <div>
      <h1 className="mb-3 text-2xl">Error</h1>
      <p>
        {error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : "Something went wrong"}
      </p>
      <button className="mt-3 rounded-lg border px-3 py-1" onClick={reset}>
        Try Again
      </button>
    </div>
  );
}
