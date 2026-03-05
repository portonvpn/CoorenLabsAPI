# Anime Provider Route Architecture

## Goal

Keep provider implementations isolated while exposing a single, stable anime API surface.

## Design principles

- Single public anime prefix: `/anime`.
- Provider-specific scraping/parsing logic stays inside provider folders.
- Shared ID parsing and cross-platform mapping live in common/core modules.
- New providers should be added by implementing an adapter and registering it once.

## Current structure

```txt
src/
  index.ts
  anizip/
    anizip.ts
    types.ts
  core/
    config.ts
    idResolver.ts
    logger.ts
    mappingRoutes.ts
    proxy.ts
    proxyRoute.ts
  providers/
    anime/
      route.ts
      registry.ts
      types.ts
      common/
        resolver.ts
      animepahe/
        animepahe.ts
        route.ts
        types.ts
        scraper/
          decrypt.ts
          index.ts
          unpacker.ts
          utils.ts
```

## Responsibilities

### `src/providers/anime/route.ts`
Main public route layer:

- `GET /anime`
- `GET /anime/search/:query`
- `GET /anime/latest`
- `GET /anime/:id`
- `GET /anime/:id/:provider`
- `GET /anime/:id/:provider/episodes`
- `GET /anime/:id/:provider/episode/:ep`

### `src/providers/anime/registry.ts`

- Declares provider instances.
- Exposes provider validation and lookup helpers.

### `src/providers/anime/types.ts`

- Defines the adapter contract (`AnimeProviderAdapter`) all providers must implement.

### `src/providers/anime/common/resolver.ts`

- Converts parsed/mapped IDs into provider-native IDs through provider adapter methods.

### `src/core/idResolver.ts`

- Parses incoming IDs.
- Resolves AniZip mappings.
- Supports prefixed IDs (MAL, TMDB, IMDB, Kitsu, AniDB, AniSearch, LiveChart) and native IDs.

### `src/core/mappingRoutes.ts`

- Exposes generic mapping endpoint at `/mappings`.

### `src/core/proxyRoute.ts`

- Exposes proxy endpoints under `/proxy` for media and generic URL proxying.

## Why this architecture works

- Avoids multi-provider merge conflicts in one giant route file.
- Keeps provider logic modular and independently testable.
- Keeps API consumers on stable, provider-agnostic top-level routes.
