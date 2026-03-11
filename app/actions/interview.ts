"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { transcribeAudio } from "@/lib/openai";
import { answerSession, getSessionView, startSession, getSessionHistory } from "@/lib/civics/session-store";

const VoiceAnswerSchema = z.object({
    sessionId: z.string(),
    audioBase64: z.string(),
});

async function verifyPlusPlan() {
    const { userId, has } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const isPlus = has ? has({ plan: "plus" } as any) : false;
    if (!isPlus) {
        throw new Error("Premium feature. Please upgrade to the Plus plan.");
    }
    return userId;
}

export async function submitVoiceAnswer(payload: z.infer<typeof VoiceAnswerSchema>) {
    const userId = await verifyPlusPlan();

    const result = VoiceAnswerSchema.safeParse(payload);
    if (!result.success) throw new Error("Invalid request payload");

    const { sessionId, audioBase64 } = result.data;
    const audioBuffer = Buffer.from(audioBase64, "base64");
    const transcript = await transcribeAudio(audioBuffer);

    const session = await answerSession({ userId, sessionId, transcript });
    return { session, transcript };
}

export async function fetchSession(sessionId: string) {
    const userId = await verifyPlusPlan();
    return getSessionView(sessionId, userId);
}

export async function createNewSession() {
    const userId = await verifyPlusPlan();
    return startSession(userId);
}

export async function fetchSessionHistory() {
    const userId = await verifyPlusPlan();
    return getSessionHistory(userId);
}
