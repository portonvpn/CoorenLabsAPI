import { Logger } from "../core/logger";
import {
  aniZipResponseSchema,
  mappingsSchema,
} from "./types";
import type { AniZipEpisode, AniZipResponse, ExternalMappings } from "./types";

const ANI_ZIP_BASE = "https://api.ani.zip";

type LookupParams = {
  mal_id?: number;
  anilist_id?: number;
  themoviedb_id?: number;
  imdb_id?: string;
  kitsu_id?: number;
  anidb_id?: number;
  anisearch_id?: number;
  livechart_id?: number;
};


export class AniZip {
  private static buildQuery(params: LookupParams): string {
    const entries = Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null,
    );
    if (entries.length === 0) return "";
    return entries.map(([k, v]) => `${k}=${v}`).join("&");
  }

  static async getMappings(
    params: LookupParams,
  ): Promise<ExternalMappings | null> {
    try {
      const query = this.buildQuery(params);
      if (!query) return null;

      const res = await fetch(`${ANI_ZIP_BASE}/mappings?${query}`);
      if (!res.ok) {
        Logger.warn(
          `AniZip getMappings failed: ${res.status} ${res.statusText}`,
        );
        return null;
      }

      const json = (await res.json()) as Record<string, unknown>;
      const parsed = mappingsSchema.safeParse(json?.mappings);

      if (!parsed.success) {
        Logger.warn(`AniZip getMappings: invalid mappings shape`);
        return null;
      }

      return {
        mal_id: parsed.data.mal_id ?? null,
        anilist_id: parsed.data.anilist_id ?? null,
        themoviedb_id: parsed.data.themoviedb_id ?? null,
        imdb_id: parsed.data.imdb_id ?? null,
        thetvdb_id: parsed.data.thetvdb_id ?? null,
        kitsu_id: parsed.data.kitsu_id ?? null,
        anidb_id: parsed.data.anidb_id ?? null,
        anisearch_id: parsed.data.anisearch_id ?? null,
        livechart_id: parsed.data.livechart_id ?? null,
      };
    } catch (err) {
      Logger.warn(`AniZip getMappings error: ${String(err)}`);
      return null;
    }
  }

  // same as getMappings but ask for ALL the things (titles, episodes, images,
  // the kitchen sink). again, null means AniZip was having a bad day.
  static async getFullData(
    params: LookupParams,
  ): Promise<AniZipResponse | null> {
    try {
      const query = this.buildQuery(params);
      if (!query) return null;

      const res = await fetch(`${ANI_ZIP_BASE}/mappings?${query}`);
      if (!res.ok) {
        Logger.warn(
          `AniZip getFullData failed: ${res.status} ${res.statusText}`,
        );
        return null;
      }

      const json = await res.json();
      const parsed = aniZipResponseSchema.safeParse(json);

      if (!parsed.success) {
        Logger.warn(`AniZip getFullData: invalid response shape`);
        return null;
      }

      const d = parsed.data;
      return {
        mappings: {
          mal_id: d.mappings.mal_id ?? null,
          anilist_id: d.mappings.anilist_id ?? null,
          themoviedb_id: d.mappings.themoviedb_id ?? null,
          imdb_id: d.mappings.imdb_id ?? null,
          thetvdb_id: d.mappings.thetvdb_id ?? null,
          kitsu_id: d.mappings.kitsu_id ?? null,
          anidb_id: d.mappings.anidb_id ?? null,
          anisearch_id: d.mappings.anisearch_id ?? null,
          livechart_id: d.mappings.livechart_id ?? null,
        },
        titles: d.titles,
        episodes: d.episodes as Record<string, AniZipEpisode>,
        episodeCount: d.episodeCount,
        specialCount: d.specialCount,
        images: d.images,
      };
    } catch (err) {
      Logger.warn(`AniZip getFullData error: ${String(err)}`);
      return null;
    }
  }

  // convenience wrapper that fetches the full response then plucks just
  // the episode metadata. null means the universe doesn't want you to have
  // episode info right now.
  static async getEpisodes(
    params: LookupParams,
  ): Promise<AniZipEpisode[] | null> {
    try {
      const full = await this.getFullData(params);
      if (!full) return null;
      return Object.values(full.episodes);
    } catch (err) {
      Logger.warn(`AniZip getEpisodes error: ${String(err)}`);
      return null;
    }
  }
}
