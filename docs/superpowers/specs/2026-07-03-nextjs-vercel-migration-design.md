# Next.js Vercel Migration Design

## Goal

Convert the portfolio from a Vite React app with Express/Vercel API functions into a Vercel-native Next.js App Router project. The migration should preserve the existing visual design and chatbot behavior while removing the deployment ambiguity that caused production module-resolution errors.

## Recommended Approach

Use an in-place Next.js App Router migration. Keep the current repository, components, Tailwind styling, and API behavior, but replace the Vite/Express application shell with Next.js conventions.

This avoids a full visual rebuild while giving Vercel a standard project shape:

- `src/app/page.tsx` for the portfolio page.
- `src/app/layout.tsx` and `src/app/globals.css` for the application shell and global styles.
- `src/app/api/chat/route.ts` for the chatbot endpoint.
- `src/app/api/contact/route.ts` for contact form submission.
- `src/app/api/contact/messages/route.ts` for contact message retrieval.
- `src/server/*` for server-only helpers such as OpenRouter and in-memory storage.
- `src/shared/*` for schemas shared by route handlers and tests.

## Architecture

The deployed app should be a single Next.js project. Client interactivity remains in client components, especially the chatbot and contact form. Server work moves into route handlers instead of Express middleware or Vercel's standalone `api/` folder.

The Express server, Vite app shell, and custom Vercel rewrite configuration should be removed once their responsibilities are covered by Next.js. Vercel should auto-detect the framework and run the normal Next.js build.

## API Design

`POST /api/chat` accepts the existing chatbot payload:

- `message: string`
- optional `conversationHistory`

It validates with `zod`, reads `OPENROUTER_API_KEY` or `OPENROUTER_API_KEY_ALEX`, calls OpenRouter, and returns the current response shape:

- `{ success: true, message: string }`
- `{ success: false, message: string, errors?: unknown }`

`POST /api/contact` and `GET /api/contact/messages` should preserve their current JSON behavior. The current in-memory storage can remain for now because this migration is about deployment structure, not persistence.

## Styling And Assets

Preserve the current Tailwind theme and shadcn-style component usage. Move the global CSS into the Next.js app directory and keep the existing component class names. Existing attached assets that are imported by the UI should remain usable after the migration, either through direct imports or placement under `public` when needed.

## Testing And Verification

The migration is complete when:

- TypeScript passes.
- OpenRouter helper tests pass.
- The Next.js production build passes.
- The local app renders the portfolio page.
- The chatbot route no longer depends on `api/index.js`, Express, or extensionless ESM imports.

## Non-Goals

- Redesigning the portfolio.
- Adding database persistence.
- Adding authentication for admin contact message retrieval.
- Changing the chatbot prompt or model unless required for compatibility.
