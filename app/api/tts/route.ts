import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { generateOfficerSpeech } from "@/lib/openai";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

const TTS_DIR = path.join(process.cwd(), "public", "audio", "tts");

function textToFilename(text: string): string {
    const hash = crypto.createHash("sha256").update(text).digest("hex").slice(0, 16);
    return `${hash}.mp3`;
}

export async function GET(request: Request) {
    const { userId, has } = await auth();

    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    // Protect route for Plus plan only
    const isPlus = has ? has({ plan: "plus" } as any) : false;
    if (!isPlus) {
        return new NextResponse("Premium feature. Please upgrade to the Plus plan.", { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const text = searchParams.get("text");

    if (!text) {
        return new NextResponse("Text parameter is required", { status: 400 });
    }

    // ── Static cache check ────────────────────────────────────────────────────
    // If this exact text was pre-generated, redirect to the static file.
    // This avoids any OpenAI API call for pre-cached content.
    const filename = textToFilename(text);
    const staticPath = path.join(TTS_DIR, filename);

    if (fs.existsSync(staticPath)) {
        return NextResponse.redirect(
            new URL(`/audio/tts/${filename}`, request.url),
            { status: 302 }
        );
    }

    // ── Live generation fallback ──────────────────────────────────────────────
    // Only reached for text that has NOT been pre-generated.
    try {
        const audioBuffer = await generateOfficerSpeech(text);

        return new NextResponse(new Uint8Array(audioBuffer), {
            headers: {
                "Content-Type": "audio/mpeg",
                "Content-Disposition": `inline; filename="officer.mp3"`,
            },
        });
    } catch (error) {
        console.error("TTS generation error:", error);
        return new NextResponse("Failed to generate TTS audio", { status: 500 });
    }
}
