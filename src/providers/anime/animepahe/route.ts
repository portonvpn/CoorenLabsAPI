import type { AnimeProviderAdapter } from "../types";
import { Animepahe } from "./animepahe";

export const animepaheProvider: AnimeProviderAdapter = {
  name: "animepahe",
  search: (query: string) => Animepahe.search(query),
  latest: () => Animepahe.latest(),
  resolveByExternalId: (params) => Animepahe.resolveByExternalId(params),
  info: (nativeId: string) => Animepahe.info(nativeId),
  getEpisodeSession: (nativeId: string, episodeNumber: number) =>
    Animepahe.getEpisodeSession(nativeId, episodeNumber),
  streams: (nativeId: string, episodeSession: string) => Animepahe.streams(nativeId, episodeSession),
  getMappingsAndName: (nativeId: string) => Animepahe.getMappingsAndName(nativeId),
};
