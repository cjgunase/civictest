import { z } from "zod";
import OpenAI, { toFile } from "openai";
import type { Verdict } from "@/lib/domain/civics";

// Ensure the OpenAI client is configured. It will automatically pick up OPENAI_API_KEY from env.
const openai = new OpenAI();

/**
 * Transcribes audio buffer to text using Whisper.
 */
export async function transcribeAudio(audioBuffer: Buffer, fileName = "audio.webm"): Promise<string> {
    const file = await toFile(audioBuffer, fileName, { type: "audio/webm" });
    const transcription = await openai.audio.transcriptions.create({
        file,
        model: "whisper-1",
    });
    return transcription.text;
}

/**
 * Generates an audio buffer from text using TTS.
 */
export async function generateOfficerSpeech(text: string): Promise<Buffer> {
    const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy", // Using 'alloy' for a neutral or professional voice
        input: text,
    });
    return Buffer.from(await mp3.arrayBuffer());
}

/**
 * Uses LLM fallback to resolve an uncertain verdict.
 */
export async function gradeWithLLMFallback(
    transcript: string,
    question: string,
    acceptedAnswers: string[]
): Promise<{ verdict: Verdict; reason: string }> {
    // Define strict output schema for the LLM fallback.
    // The defined schema matches the JSON object we expect back
    // { verdict: "CORRECT" | "INCORRECT", reason: string }

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `You are an official US Citizenship and Immigration Services grading assistant.
The user is taking the civics test.
Given the question, the user's raw transcript answer, and a list of accepted correct answers, determine if the user's answer is semantically equivalent to ANY of the accepted answers.
An answer doesn't need to be exact, but it must capture the core meaning. If the user said mostly correct things with some extra conversational filler, it is CORRECT.
If the meaning is wrong, or too vague, it is INCORRECT.
Output a JSON object with two keys: "verdict" (either "CORRECT" or "INCORRECT") and "reason" (a brief string explanation).`,
            },
            {
                role: "user",
                content: `Question: ${question}\nAccepted Answers:\n${acceptedAnswers
                    .map((a) => `- ${a}`)
                    .join("\n")}\n\nUser's Transcript Answer:\n"${transcript}"`,
            },
        ],
        // Let's use standard JSON mode with zod parsing, since gpt-4o-mini supports structured outputs directly if formatted properly.
        response_format: { type: "json_object" },
        temperature: 0.1, // Keep it deterministic
    });

    try {
        const rawContent = completion.choices[0]?.message.content || "{}";
        const parsed = JSON.parse(rawContent);

        // If it successfully mapped to correct/incorrect, return it
        if (parsed.verdict === "CORRECT" || parsed.verdict === "INCORRECT") {
            return {
                verdict: parsed.verdict,
                reason: parsed.reason || "Determined by LLM fallback.",
            };
        }

        return { verdict: "INCORRECT", reason: "LLM fallback failed to produce a valid verdict." };
    } catch (error) {
        console.error("LLM Fallback parsing error:", error);
        return { verdict: "INCORRECT", reason: "LLM fallback parsing error." };
    }
}
