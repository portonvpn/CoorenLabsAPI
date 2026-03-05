import type { ParsedId } from "../../../core/idResolver";
import type { ExternalMappings } from "../../../anizip";
import type { AnimeProviderAdapter } from "../types";

export async function resolveToProviderNativeId(
  parsed: ParsedId,
  mappings: ExternalMappings | null,
  provider: AnimeProviderAdapter,
): Promise<string | null> {
  if (parsed.type === "native") {
    return parsed.value;
  }

  const malId = mappings?.mal_id ?? (parsed.type === "mal" ? parsed.numericValue : undefined);
  const anilistId = mappings?.anilist_id ?? (parsed.type === "anilist" ? parsed.numericValue : undefined);

  if (!malId && !anilistId) {
    return null;
  }

  return provider.resolveByExternalId({
    mal_id: malId ?? undefined,
    anilist_id: anilistId ?? undefined,
  });
}
