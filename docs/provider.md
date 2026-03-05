# Adding a New Anime Provider

This guide explains how to add a provider to the unified `/anime` API.

## 1) Create provider folder

Create a new folder in:

```txt
src/providers/anime/<providerName>/
```

Recommended files:

- `<providerName>.ts` (provider implementation)
- `route.ts` (adapter export)
- `types.ts` (provider-local types)
- `scraper/*` (if needed)

## 2) Implement the adapter contract

Your provider must satisfy `AnimeProviderAdapter` from `src/providers/anime/types.ts`:

- `name`
- `search(query)`
- `latest()`
- `resolveByExternalId({ mal_id?, anilist_id? })`
- `info(nativeId)`
- `getEpisodeSession(nativeId, episodeNumber)`
- `streams(nativeId, episodeSession)`
- `getMappingsAndName(nativeId)`

## 3) Export provider adapter

In your provider `route.ts`, export an adapter object instance that matches `AnimeProviderAdapter`.

## 4) Register provider once

Edit `src/providers/anime/registry.ts` and add your provider:

```ts
export const animeProviderRegistry = {
  animepahe: animepaheProvider,
  yourprovider: yourProvider,
} as const;
```

That automatically updates:

- Supported provider list (`SUPPORTED_ANIME_PROVIDERS`)
- Provider validation (`isValidAnimeProvider`)
- Provider lookup (`getAnimeProvider`)

## 5) Validate ID resolution support

If your provider can resolve by MAL/AniList only, ensure `resolveByExternalId` handles at least those two.

The route layer already resolves many ID inputs (`tmdb:`, `imdb:`, etc.) to usable mappings before calling provider resolution.

## 6) Test with unified endpoints

Run API:

```bash
bun run dev
```

Then verify:

- `GET /anime/search/<query>?provider=<providerName>`
- `GET /anime/latest?provider=<providerName>`
- `GET /anime/<id>/<providerName>`
- `GET /anime/<id>/<providerName>/episodes`
- `GET /anime/<id>/<providerName>/episode/<ep>`

## 7) Add provider tests

Add a provider test suite in `scripts/tests/` and include it from `scripts/tests/index.ts`.

## Common pitfalls

- Registering provider under the wrong key in `registry.ts`.
- Returning malformed `info` or `streams` payloads.
- Not handling episode number parsing consistently.
- Forgetting to return `null` when provider-native ID cannot be resolved.
