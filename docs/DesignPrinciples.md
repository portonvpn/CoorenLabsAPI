# Anime Provider Route Architecture

## Goal
Create a provider-isolated routing architecture so each anime provider can be developed independently without merge conflicts in a single shared route file.

## Design Principles
- Keep one main anime entry route: `/provider/anime` (implemented as `/anime` prefix in server mount).
- Each provider owns its own internal route module and resolver logic.
- Shared logic (ID parsing, mapping lookup, common response shaping) stays in a common layer.
- Adding a new provider should only require:
  1) creating a provider folder,
  2) implementing adapter methods,
  3) registering it once.

## Proposed Structure

```txt
src/
  providers/
    anime/
      route.ts                 # main anime routes (public entrypoint)
      registry.ts              # provider registry and lookup
      types.ts                 # shared provider adapter contracts
      common/
        resolver.ts            # common ID -> provider-native resolution
      animepahe/
        route.ts               # animepahe adapter wrapper for route layer
        animepahe.ts           # provider implementation
        types.ts
        scraper/
          decrypt.ts
          index.ts
          unpacker.ts
          utils.ts
```

## Responsibilities

### `providers/anime/route.ts` (Main Route)
- Hosts public endpoints:
  - `GET /anime/`
  - `GET /anime/search/:query`
  - `GET /anime/latest`
  - `GET /anime/:id`
  - `GET /anime/:id/:provider`
  - `GET /anime/:id/episodes/:provider`
  - `GET /anime/:id/episode/:ep/:provider`
- Uses provider registry, not provider classes directly.

### `providers/anime/animepahe/route.ts` (Internal Provider Route Adapter)
- Exposes AnimePahe-specific adapter methods behind shared interface:
  - `search`, `latest`, `resolveByExternalId`, `info`, `getEpisodeSession`, `streams`, `getMappingsAndName`
- Owns only AnimePahe concerns.

### `providers/anime/registry.ts`
- Central place to register available providers.
- Enables provider lookup and supported provider listing.

### `providers/anime/common/resolver.ts`
- Shared helper for converting parsed IDs + AniZip mappings into provider-native IDs.
- Keeps generic route behavior out of provider-specific files.

## Collaboration Benefit
- Dev A can modify `providers/anime/animepahe/*`.
- Dev B can modify `providers/anime/hianime/*`.
- Main route and registry remain stable and minimal, reducing cross-provider conflicts.

## Migration Plan
1. Add shared adapter contracts and registry.
2. Add AnimePahe internal adapter route module.
3. Move main route from `core/animeRoutes.ts` to `providers/anime/route.ts`.
4. Update `src/index.ts` to use new main route module.
5. Keep backward compatibility by re-exporting from `core/animeRoutes.ts`.
6. Remove legacy duplicate folder `src/providers/animepahe`.

## Future Provider Onboarding (Example: hianime)
1. Create `src/providers/anime/hianime/`.
2. Implement `hianime.ts` and `route.ts` adapter.
3. Register `hianime` in `providers/anime/registry.ts`.
4. No changes needed in existing AnimePahe files.
