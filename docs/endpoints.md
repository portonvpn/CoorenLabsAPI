# API Endpoints

Base URL: `http://localhost:3000`

## Root

### `GET /`
Service metadata and status.

## Anime API (`/anime`)

### `GET /anime`
Returns service info, supported providers, and endpoint list.

### `GET /anime/search/:query?provider=<provider>`
Search anime from selected provider.

- Default provider: `animepahe`
- Example: `GET /anime/search/one%20piece?provider=animepahe`

### `GET /anime/latest?provider=<provider>`
Latest releases from selected provider with mapping enrichment.

- Default provider: `animepahe`
- Example: `GET /anime/latest?provider=animepahe`

### `GET /anime/:id`
Resolve ID to mappings/titles/provider metadata.

Supported ID formats:

- Bare AniList ID: `21`
- `mal:20`
- `tmdb:46260`
- `imdb:tt0388629`
- `kitsu:12`
- `anidb:69`
- `anisearch:2227`
- `livechart:321`
- Provider-native IDs (passed as native)

Examples:

- `GET /anime/21`
- `GET /anime/tmdb:37854`
- `GET /anime/imdb:tt0388629`

### `GET /anime/:id/:provider`
Get provider-specific anime info.

Example:

- `GET /anime/21/animepahe`

### `GET /anime/:id/:provider/episodes`
Get episode list for selected provider.

Example:

- `GET /anime/21/animepahe/episodes`

### `GET /anime/:id/:provider/episode/:ep`
Get streams for a specific episode.

Example:

- `GET /anime/21/animepahe/episode/1`

## Mapping API

### `GET /mappings?mal_id=<id>`
### `GET /mappings?anilist_id=<id>`
Resolve cross-platform mappings from AniZip.

Examples:

- `GET /mappings?mal_id=21`
- `GET /mappings?anilist_id=21`

## Proxy API (`/proxy`)

### `GET /proxy`
Proxy service info and available proxy endpoints.

### `GET /proxy/image/:url`
Proxy image URL.

### `GET /proxy/stream/:url`
Proxy stream URL.

### `GET /proxy/fetch/:url`
Generic direct fetch proxy.

### `GET /proxy/m3u8-proxy?url=<url>&headers=<encodedJson>`
Advanced playlist proxy with rewritten segment URLs.

### `GET /proxy/ts-segment?url=<url>&headers=<encodedJson>`
Proxy TS segment with caching.

### `GET /proxy/mp4-proxy?url=<url>&headers=<encodedJson>`
Proxy MP4 with range request support.

### `GET /proxy/generic?url=<url>&headers=<encodedJson>`
Advanced generic proxy endpoint.

## Current status

These endpoint groups are implemented in code and covered by the refreshed test script:

- Root (`/`) ✅
- Anime unified routes (`/anime/*`) ✅
- ID resolution via AniZip-backed mappings ✅
- Mappings route (`/mappings`) ✅
- Proxy index (`/proxy`) ✅
