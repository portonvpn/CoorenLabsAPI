import type { ExternalMappings } from "../../anizip";

export interface ProviderAnimeInfo {
  id: string;
  name: string;
  mappings: ExternalMappings | null;
  episodes: unknown[];
}

export interface AnimeProviderAdapter {
  name: string;
  search(query: string): Promise<unknown[]>;
  latest(): Promise<unknown[]>;
  resolveByExternalId(params: { mal_id?: number; anilist_id?: number }): Promise<string | null>;
  info(nativeId: string): Promise<ProviderAnimeInfo | null>;
  getEpisodeSession(nativeId: string, episodeNumber: number): Promise<string | null>;
  streams(nativeId: string, episodeSession: string): Promise<unknown[]>;
  getMappingsAndName(nativeId: string): Promise<{ mappings: ExternalMappings | null; name: string } | null>;
}
