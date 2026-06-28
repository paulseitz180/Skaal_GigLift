# GigLift

**Promote Your Show. Not Your Inbox.**

GigLift is a voice-first iOS app that lets working musicians promote a show in
under two minutes. The artist speaks a sentence about their gig, and GigLift
handles the rest — fan emails, social posts, a press release, and a promotion
timeline.

This repository contains the React Native (Expo) prototype.

> **Status:** PR-001 — Project Foundation. This PR sets up the project
> scaffolding, tooling, and a placeholder screen only. Authentication, Supabase,
> navigation, and product features are intentionally **not** implemented yet.

## Tech Stack

| Layer            | Technology                                                |
| ---------------- | --------------------------------------------------------- |
| Framework        | [Expo](https://expo.dev/) + React Native                  |
| Language         | TypeScript (strict mode)                                  |
| Routing          | [Expo Router](https://docs.expo.dev/router/introduction/) |
| State management | [Zustand](https://github.com/pmndrs/zustand)              |
| Gestures         | React Native Gesture Handler                              |
| Animations       | React Native Reanimated                                   |
| Secure storage   | Expo Secure Store                                         |
| Tooling          | ESLint, Prettier, Husky, lint-staged                      |

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ (LTS recommended)
- npm 9+ (this project uses **npm** as its package manager)
- macOS with [Xcode](https://developer.apple.com/xcode/) + the iOS Simulator
  (required to run on iOS)

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

## Environment Variables

Copy the example file and fill in values as they become relevant in later PRs:

```bash
cp .env.example .env
```

| Variable                        | Description                                           |
| ------------------------------- | ----------------------------------------------------- |
| `EXPO_PUBLIC_APP_ENV`           | App environment: `development`/`staging`/`production` |
| `EXPO_PUBLIC_SUPABASE_URL`      | Supabase project URL (Settings → API)                 |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key (Settings → API)               |

Variables prefixed with `EXPO_PUBLIC_` are bundled into the client and are **not
secret**. `.env` is git-ignored and should never be committed. The Supabase
variables are required by the Supabase client (`supabase/client.ts`).

## Running the App

Start the app on the iOS Simulator:

```bash
npm run ios
```

Other useful scripts:

```bash
npm start          # Start the Expo dev server (choose a target interactively)
npm run android    # Build and run on Android
npm run web        # Run in the browser
```

## Project Structure

```text
app/          # Screens & routes (Expo Router)
assets/       # Images, fonts, and other static assets
components/   # Shared, reusable components
components/ui # Low-level UI primitives (buttons, inputs, etc.)
constants/    # App-wide constants (colors, config, etc.)
features/     # Feature-scoped modules
hooks/        # Reusable React hooks
services/     # API clients and external integrations
stores/       # Zustand stores
supabase/     # Supabase client, types, and SQL (added in a later PR)
types/        # Shared TypeScript types
utils/        # Pure utility/helper functions
```

The `@/*` path alias maps to the project root, so imports can be written as
`import { Foo } from '@/components/Foo'`.

## Code Quality

```bash
npm run lint          # Lint the codebase
npm run lint:fix      # Lint and auto-fix
npm run format        # Format with Prettier
npm run format:check  # Check formatting without writing
npm run typecheck     # Type-check with no emit
```

A Husky `pre-commit` hook runs `lint-staged`, which lints and formats only the
files you are committing.

## License

Confidential — Internal Use Only. © Skaal Solutions.
