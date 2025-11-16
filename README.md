## Todo

I wanted to try out TanStack Start (which is still in beta) so I made this
simple todo app with Google authentication and a MongoDB database.

https://github.com/user-attachments/assets/2a55fe41-7ef6-4c91-968e-36cbcb26c68d

NOTE: because it's using a release candidate I have not deployed this anywhere
yet, but it does work locally and has comprehensive unit tests:

<img width="503" height="659" alt="coverage" src="https://github.com/user-attachments/assets/e7188512-e04c-4f44-af43-064f730f0f5c" />

### Environment

You'll need the following env vars:

- `VITE_BASE_URL`: http://localhost:3000 in development
- `GOOGLE_CLIENT_ID`: your Google API client ID
- `GOOGLE_CLIENT_SECRET`: your Google API client secret
- `MONGO_URI`: your MongoDB connection string
- `SESSION_SECRET`: a secret key of your choosing (min 30 chars)

### Scripts

This project uses pnpm as its package manager.

Install dependencies:

```bash
pnpm i
```

Start the development server:

```bash
pnpm dev
```

Run unit tests in watch mode:

```bash
pnpm test
```

Run unit tests and generate a coverage report:

```bash
pnpm test run --coverage
```
