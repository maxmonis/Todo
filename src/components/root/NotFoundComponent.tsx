import { Link } from "@tanstack/react-router";

export function NotFoundComponent() {
  return (
    <div>
      <h1 className="mb-3 text-2xl">404: Not Found</h1>
      <Link className="underline" replace to="/">
        Return Home
      </Link>
    </div>
  );
}
