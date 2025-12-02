import { HeadContent, Scripts } from "@tanstack/react-router";

export function ShellComponent({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body
        className="min-h-screen bg-linear-to-br from-purple-950 via-purple-900 to-black p-5 text-white"
        style={{
          backgroundImage:
            "radial-gradient(50% 50% at 80% 20%, #3B021F 0%, #7B1028 60%, #1A000A 100%)",
        }}
      >
        {children}
        <Scripts />
      </body>
    </html>
  );
}
