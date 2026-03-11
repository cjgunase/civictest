/**
 * scripts/generate-tts-cache.ts
 *
 * One-time TTS pre-generation script.
 * Run with: npm run tts:generate
 *
 * Generates MP3 files for every civics question prompt,
 * the intro script, and end-of-interview messages.
 * Saves them to public/audio/tts/ and writes a manifest.json.
 */

import "dotenv/config";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import OpenAI from "openai";
import { QUESTION_BANK } from "../lib/civics/question-bank";
import { INTRO_SCRIPT } from "../lib/civics/engine";

// ─── Config ───────────────────────────────────────────────────────────────────

const OUTPUT_DIR = path.join(process.cwd(), "public", "audio", "tts");
const MANIFEST_PATH = path.join(OUTPUT_DIR, "manifest.json");
const TTS_MODEL = "tts-1";
const TTS_VOICE = "alloy";

// Non-question audio cues
const STATIC_CLIPS: Record<string, string> = {
    intro: INTRO_SCRIPT,
    pass_end: "Congratulations! You have passed the civics test!",
    fail_end: "The interview is now complete. Please review your results.",
};

// ─── Utilities ────────────────────────────────────────────────────────────────

function textToFilename(text: string): string {
    const hash = crypto.createHash("sha256").update(text).digest("hex").slice(0, 16);
    return `${hash}.mp3`;
}

async function generateAudio(client: OpenAI, text: string): Promise<Buffer> {
    const mp3 = await client.audio.speech.create({
        model: TTS_MODEL,
        voice: TTS_VOICE,
        input: text,
    });
    return Buffer.from(await mp3.arrayBuffer());
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
    if (!process.env.OPENAI_API_KEY) {
        console.error("❌  OPENAI_API_KEY is not set. Add it to .env.local first.");
        process.exit(1);
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Ensure output directory exists
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    // Load existing manifest so we can skip already-generated files
    let manifest: Record<string, string> = {};
    if (fs.existsSync(MANIFEST_PATH)) {
        try {
            manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
            console.log(`📋  Loaded existing manifest with ${Object.keys(manifest).length} entries.`);
        } catch {
            console.warn("⚠️  Could not parse existing manifest. Starting fresh.");
        }
    }

    // Build the full list of items to process
    type AudioItem = { key: string; text: string };
    const items: AudioItem[] = [
        // Static cues
        ...Object.entries(STATIC_CLIPS).map(([key, text]) => ({ key, text })),
        // All question prompts
        ...QUESTION_BANK.map((q) => ({ key: q.id, text: q.prompt })),
    ];

    console.log(`\n🎙️  Generating TTS for ${items.length} audio clips...\n`);

    let generated = 0;
    let skipped = 0;
    let failed = 0;

    for (const item of items) {
        const filename = textToFilename(item.text);
        const outputPath = path.join(OUTPUT_DIR, filename);
        const publicUrl = `/audio/tts/${filename}`;

        // Skip if the file already exists AND manifest is up to date
        if (manifest[item.key] === publicUrl && fs.existsSync(outputPath)) {
            process.stdout.write(`  ⏭️  Skipping ${item.key} (cached)\n`);
            skipped++;
            continue;
        }

        try {
            process.stdout.write(`  🔊  Generating ${item.key}...`);
            const audio = await generateAudio(client, item.text);
            fs.writeFileSync(outputPath, audio);
            manifest[item.key] = publicUrl;
            process.stdout.write(` ✓\n`);
            generated++;

            // Save manifest incrementally so progress survives crashes
            if (generated % 10 === 0) {
                fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
            }

            // Small delay to avoid rate limits
            await new Promise((r) => setTimeout(r, 200));
        } catch (err) {
            process.stdout.write(` ❌\n`);
            console.error(`    Error for ${item.key}:`, err instanceof Error ? err.message : err);
            failed++;
        }
    }

    // Final manifest write
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

    // Summary
    console.log(`\n✅  Done!`);
    console.log(`   Generated : ${generated}`);
    console.log(`   Skipped   : ${skipped}`);
    console.log(`   Failed    : ${failed}`);
    console.log(`   Manifest  : ${MANIFEST_PATH}`);

    // Validation
    const manifestKeys = Object.keys(manifest);
    const questionIds = QUESTION_BANK.map((q) => q.id);
    const staticKeys = Object.keys(STATIC_CLIPS);
    const missingKeys = [...questionIds, ...staticKeys].filter((k) => !manifest[k]);
    if (missingKeys.length > 0) {
        console.warn(`\n⚠️  Missing from manifest: ${missingKeys.join(", ")}`);
    } else {
        console.log(`   Validation: All ${manifestKeys.length} keys present ✓`);
    }
}

main().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
});
