"use server";

import { db } from "@/lib/db";
import { userFlashcardStats } from "@/src/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { QUESTION_BANK } from "@/lib/civics/question-bank";

async function verifyPlusPlan() {
    const { userId, has } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const isPlus = has ? has({ plan: "plus" } as any) : false;
    if (!isPlus) {
        throw new Error("Premium feature. Please upgrade to the Plus plan.");
    }
    return userId;
}

export async function getUserFlashcards() {
    let userId;
    try {
        userId = await verifyPlusPlan();
    } catch (error) {
        return [];
    }

    return await db.select().from(userFlashcardStats).where(eq(userFlashcardStats.userId, userId));
}

// SM-2 Spaced Repetition logic
// q: 0-5 (0 = completely wrong, 5 = perfect recall)
export async function updateFlashcardStat(questionId: string, q: number) {
    let userId;
    try {
        userId = await verifyPlusPlan();
    } catch {
        return null;
    }

    const existingStats = await db
        .select()
        .from(userFlashcardStats)
        .where(and(eq(userFlashcardStats.userId, userId), eq(userFlashcardStats.questionId, questionId)));

    let stat = existingStats[0] || {
        userId,
        questionId,
        easeFactor: 2500,
        interval: 0,
        repetitions: 0,
        correctCount: 0,
        incorrectCount: 0,
    };

    // SM-2 Algorithm parameters
    let customEase = stat.easeFactor;
    let customInterval = stat.interval;
    let customRepetitions = stat.repetitions;
    let correctCount = stat.correctCount;
    let incorrectCount = stat.incorrectCount;

    if (q >= 3) { // Correct
        correctCount += 1;
        if (customRepetitions === 0) {
            customInterval = 1;
        } else if (customRepetitions === 1) {
            customInterval = 6;
        } else {
            customInterval = Math.round(customInterval * (customEase / 1000));
        }
        customRepetitions += 1;
    } else { // Incorrect
        incorrectCount += 1;
        customRepetitions = 0;
        customInterval = 1;
    }

    // Ease calculation
    const easeChange = 1000 * (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    customEase = Math.max(1300, customEase + Math.round(easeChange)); // Minimum ease of 1.3

    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + customInterval);

    if (!existingStats[0]) {
        const updatedStats = await db.insert(userFlashcardStats).values({
            userId,
            questionId,
            easeFactor: customEase,
            interval: customInterval,
            repetitions: customRepetitions,
            correctCount,
            incorrectCount,
            lastReviewedAt: new Date(),
            nextReviewDate,
        }).returning();
        return updatedStats[0];
    } else {
        const updatedStats = await db.update(userFlashcardStats)
            .set({
                easeFactor: customEase,
                interval: customInterval,
                repetitions: customRepetitions,
                correctCount,
                incorrectCount,
                lastReviewedAt: new Date(),
                nextReviewDate,
            })
            .where(and(eq(userFlashcardStats.userId, userId), eq(userFlashcardStats.questionId, questionId)))
            .returning();
        return updatedStats[0];
    }
}
