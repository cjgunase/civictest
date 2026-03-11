/**
 * lib/tts-manifest.ts
 *
 * Loads the pre-generated TTS audio manifest.
 *
 * The manifest maps question IDs (and special keys like "intro",
 * "pass_end", "fail_end") to static file URLs like:
 *   "/audio/tts/{sha256hash}.mp3"
 *
 * This is fetched once client-side and cached in memory.
 */

export type TtsManifest = Record<string, string>;

let cached: TtsManifest | null = null;

/**
 * Fetches the manifest JSON once and caches it in memory.
 * Falls back to an empty object if the manifest is unavailable
 * (e.g., during development before running `npm run tts:generate`).
 */
export async function loadTtsManifest(): Promise<TtsManifest> {
    if (cached !== null) return cached;

    try {
        const res = await fetch("/audio/tts/manifest.json", { cache: "force-cache" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        cached = (await res.json()) as TtsManifest;
    } catch (err) {
        console.warn(
            "[TTS] Could not load pre-generated manifest. Falling back to live TTS API.",
            err
        );
        cached = {};
    }

    return cached;
}

/**
 * Returns the static audio URL for a given key, or null if not cached.
 * Caller falls back to the live /api/tts endpoint if null is returned.
 */
export function getStaticAudioUrl(manifest: TtsManifest, key: string): string | null {
    return manifest[key] ?? null;
}
