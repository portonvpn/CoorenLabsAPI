import { Redis } from "@upstash/redis";
import { Logger } from "./logger";


const ENABLE_CACHE = Bun.env.ENABLE_CACHE;
const DEFAULT_CACHE_TTL = +(Bun.env.DEFAULT_CACHE_TTL || -1);

if (
    // ENABLE_CACHE && // dont check if cache is disabled
    isNaN(DEFAULT_CACHE_TTL)
) throw new Error("Invalid `DEFAULT_CACHE_TTL` value " + Bun.env.DEFAULT_CACHE_TTL)


const UPSTASH_REDIS_REST_URL = Bun.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_REDIS_REST_TOKEN = Bun.env.UPSTASH_REDIS_REST_TOKEN;

let redis: Redis | undefined;

if (ENABLE_CACHE !== "true") {
    Logger.info("[Cache] Cache is turned off. serving without cache!");
}
else if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) {
    Logger.info("[Cache] Uptash Redis not initailized, serving without cache!");
} else {
    redis = new Redis({
        url: UPSTASH_REDIS_REST_URL,
        token: UPSTASH_REDIS_REST_TOKEN,
    });

    Logger.info("[Cache] Uptash Redis successfully initailized, now serving with cache!");
}
class Cache {
    /**
     * 
     * @param key Cache Key
     * @param value string value. use `JSON.stringy` if not a string before passing
     * @param TTL number of seconds the cache is valid for. `default:-1` which means cache is stored forever
     * @returns `true` if successfully set, otherwise `false`
     */

    static async set(key: string, value: string, TTL: number = DEFAULT_CACHE_TTL) {
        if (redis === undefined) return;

        try {
            if (TTL == -1) {
                // store forever
                await redis.set(key, value);
            } else {
                // store for TTL seconds
                await redis.set(key, value, { ex: TTL });
            }

            return true;
        } catch {
            return false;
        }
    }

    /***
     * @param key - retrives the value for the key
     * @returns  value (`string`) associated with the key, otherwise `null` 
     */
    static async get(key: string) {
        if (redis === undefined) return;

        try {
            return await redis.get(key);
        } catch {
            return null;
        }
    }

    /**
     * Purges a singe key/val cache 
     * @param key 
     * @returns `true` if purge is successfull, otherwise `false`
     */
    static async purgeSingle(key: string) {
        if (redis === undefined) return;

        try {
            await redis.unlink(key);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Purge caches with a prefix. Useful when clearing cache for a cetain provider
     * @param prefix prefix for all the keys
     * @returns `number` number of records been deleted, `false` on error
     */
    static async purgePrefix(prefix: string) {
        if (redis === undefined) return;

        try {
            let cursor = "0";
            let totalDeleted = 0;

            do {
                const [nextCursor, keys] = await redis.scan(cursor, { match: `${prefix}*` });
                if (keys.length > 0) {
                    await redis.unlink(...keys);
                    totalDeleted += keys.length;
                    cursor = nextCursor;
                    Logger.info(`[Cache] Deleted ${keys.length} records with prefix ${prefix}`);
                }
            } while (cursor !== "0");

            return totalDeleted;
        } catch {
            return false;
        }
    }
    /**
     * Purge all caches. Literally empties the all redis cache.
     * @returns `number` number of records been deleted, `false` on error 
     */
    static async purgeAll(prefix: string) {
        if (redis === undefined) return;

        try {
            const count = await redis.dbsize();
            await redis.flushdb();
            Logger.info(`[Cache] Purged ${count} records`);
            return count;
        } catch {
            return false;
        }
    }
}

