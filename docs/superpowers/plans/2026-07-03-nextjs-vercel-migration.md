# Next.js Vercel Migration Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the portfolio into a Vercel-native Next.js App Router project while preserving the existing UI and chatbot/contact behavior.

**Architecture:** Replace the Vite/Express shell with Next.js App Router. Move the page UI into `src/app/page.tsx`, API behavior into route handlers, and shared server helpers into `src/server` and `src/shared`. Remove Vite, Express runtime entrypoints, and custom Vercel rewrites after Next.js builds successfully.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, zod, OpenRouter API, Node test runner with `tsx`.

---

## Chunk 1: Next.js Project Shell

### Task 1: Update Dependencies And Scripts

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Update scripts**

Set scripts to:

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "test": "node --import tsx --test src/server/*.test.ts",
  "check": "tsc --noEmit",
  "db:push": "drizzle-kit push"
}
```

- [ ] **Step 2: Update dependencies**

Add `next`. Remove Vite-only and Express-server-only packages that are no longer used after the migration: `vite`, `@vitejs/plugin-react`, Replit Vite plugins, `express`, `@types/express`, and `esbuild` if it is only used for the old server bundle.

- [ ] **Step 3: Install dependencies**

Run: `npm.cmd install`

- [ ] **Step 4: Verify package metadata**

Run: `npm.cmd run check`

Expected: It may fail until later tasks move files, but dependency resolution should succeed.

### Task 2: Add Next.js Configuration

**Files:**
- Create: `next.config.ts`
- Modify: `tsconfig.json`
- Modify: `tailwind.config.ts`
- Modify: `components.json`

- [ ] **Step 1: Create `next.config.ts`**

Use a minimal config:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
```

- [ ] **Step 2: Update TypeScript config**

Ensure `tsconfig.json` includes `next-env.d.ts`, `.next/types/**/*.ts`, and `src/**/*`, uses `jsx: "preserve"`, and keeps aliases:

```json
"paths": {
  "@/*": ["./src/*"],
  "@shared/*": ["./src/shared/*"]
}
```

- [ ] **Step 3: Update Tailwind content paths**

Point Tailwind at `src/app/**/*`, `src/components/**/*`, `src/lib/**/*`, and any remaining shared UI files.

- [ ] **Step 4: Update shadcn aliases**

Point `components.json` aliases from `client/src` to `src`.

## Chunk 2: Move UI Into App Router

### Task 3: Create App Router Files

**Files:**
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/not-found.tsx`
- Move: `client/src/index.css` to `src/app/globals.css`
- Move: `client/src/components/**` to `src/components/**`
- Move: `client/src/hooks/**` to `src/hooks/**`
- Move: `client/src/lib/**` to `src/lib/**`

- [ ] **Step 1: Move reusable UI folders**

Move existing components, hooks, and lib files under `src`.

- [ ] **Step 2: Move global CSS**

Move `client/src/index.css` to `src/app/globals.css`.

- [ ] **Step 3: Create root layout**

Import `./globals.css`, set metadata for Alex Chan's portfolio, and render `{children}`.

- [ ] **Step 4: Create page**

Render the current portfolio sections from the old `client/src/pages/home.tsx`.

- [ ] **Step 5: Create not-found route**

Port the existing not-found UI from `client/src/pages/not-found.tsx`.

### Task 4: Mark Interactive Components As Client Components

**Files:**
- Modify: `src/components/chatbot.tsx`
- Modify: `src/components/contact.tsx`
- Modify: any component using hooks, event handlers, or browser APIs

- [ ] **Step 1: Add `"use client"` where required**

Add `"use client";` to components that use `useState`, `useEffect`, refs, event handlers, or React Query hooks.

- [ ] **Step 2: Remove Vite-only entry files**

Delete obsolete files after the Next page renders:

```text
client/index.html
client/src/main.tsx
client/src/App.tsx
client/src/pages/home.tsx
client/src/pages/not-found.tsx
vite.config.ts
```

## Chunk 3: Move Server APIs Into Route Handlers

### Task 5: Move Shared Server Modules

**Files:**
- Move: `server/openrouter.ts` to `src/server/openrouter.ts`
- Move: `server/openrouter.test.ts` to `src/server/openrouter.test.ts`
- Move: `server/storage.ts` to `src/server/storage.ts`
- Move: `shared/schema.ts` to `src/shared/schema.ts`

- [ ] **Step 1: Move files**

Move the server helper, storage helper, tests, and shared schema into `src`.

- [ ] **Step 2: Update imports**

Use `@shared/schema` or relative imports consistently from the new file locations.

- [ ] **Step 3: Run helper tests**

Run: `npm.cmd test`

Expected: OpenRouter helper tests pass.

### Task 6: Create Next.js Route Handlers

**Files:**
- Create: `src/app/api/chat/route.ts`
- Create: `src/app/api/contact/route.ts`
- Create: `src/app/api/contact/messages/route.ts`
- Delete: `api/chat.ts`
- Delete: `api/contact.ts`
- Delete: `api/contact/messages.ts`
- Delete: `server/api-handlers.ts`
- Delete: `server/app.ts`
- Delete: `server/index.ts`
- Delete: `server/routes.ts`
- Delete: `server/vite.ts`

- [ ] **Step 1: Implement `POST /api/chat`**

Validate request JSON with the existing chat schema, call OpenRouter, and return `NextResponse.json` with the existing response shape.

- [ ] **Step 2: Implement `POST /api/contact`**

Validate contact payload, store it with the existing storage helper, and return the existing success/error JSON.

- [ ] **Step 3: Implement `GET /api/contact/messages`**

Return stored messages or an error JSON.

- [ ] **Step 4: Remove old API and Express files**

Delete the old Vercel `api` folder and Express server files once routes compile.

## Chunk 4: Vercel Cleanup And Verification

### Task 7: Remove Legacy Build Config

**Files:**
- Modify or delete: `vercel.json`
- Delete: `postcss.config.js` only if Next/Tailwind no longer needs the existing file
- Keep: `drizzle.config.ts` if still useful

- [ ] **Step 1: Simplify Vercel config**

Delete `vercel.json` unless a specific setting remains necessary. Vercel should auto-detect Next.js.

- [ ] **Step 2: Search for legacy references**

Run: `rg "vite|express|server/app|api/index|client/src|/api\\)" -n`

Expected: no remaining runtime references to deleted Vite/Express entrypoints.

### Task 8: Verify The Migration

**Files:**
- All changed files

- [ ] **Step 1: Typecheck**

Run: `npm.cmd run check`

Expected: pass.

- [ ] **Step 2: Test**

Run: `npm.cmd test`

Expected: pass.

- [ ] **Step 3: Production build**

Run: `npm.cmd run build`

Expected: `next build` succeeds.

- [ ] **Step 4: Local browser check**

Run: `npm.cmd run dev`, open the local URL, confirm the portfolio renders and the chatbot UI opens.

- [ ] **Step 5: Commit migration**

Commit the complete migration after checks pass:

```bash
git add .
git commit -m "Migrate portfolio to Next.js App Router"
```
