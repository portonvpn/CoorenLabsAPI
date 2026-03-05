# Cooren Docs

This folder contains the maintained technical documentation for the current API and provider architecture.

## What is inside

- `architecture.md` — system layout, routing model, and responsibilities.
- `provider.md` — step-by-step guide to add a new anime provider.
- `endpoints.md` — complete endpoint list with examples and expected behavior.

## Important details

- Unified anime API routes live under `/anime` (not provider-prefixed top-level routes).
- Provider selection is done with `:provider` route params or `provider` query param where applicable.
- Supported anime ID formats include bare AniList IDs and prefixed IDs such as `mal:`, `tmdb:`, `imdb:`, `kitsu:`, `anidb:`, `anisearch:`, `livechart:`, and provider-native IDs.
- `GET /mappings` currently accepts `mal_id` or `anilist_id` query params.
- Proxy utilities are exposed under `/proxy`.

## Quick start

1. Start API: `bun run dev`
2. Run tests: `bun run test`
3. Read API reference: `docs/endpoints.md`
4. Add a provider: `docs/provider.md`
