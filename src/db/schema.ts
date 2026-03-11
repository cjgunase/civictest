import { integer, pgTable, varchar, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    age: integer().notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
});

export const userFlashcardStats = pgTable("user_flashcard_stats", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: varchar({ length: 255 }).notNull(),
    questionId: varchar({ length: 255 }).notNull(),
    easeFactor: integer().notNull().default(2500), // 2.5 * 1000
    interval: integer().notNull().default(0), // in days
    repetitions: integer().notNull().default(0),
    correctCount: integer().notNull().default(0),
    incorrectCount: integer().notNull().default(0),
    nextReviewDate: timestamp("next_review_date").notNull().defaultNow(),
    lastReviewedAt: timestamp("last_reviewed_at"),
});

export const siteVisitors = pgTable("site_visitors", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    ipHash: varchar({ length: 255 }), // Hash to avoid logging same user infinitely
    city: varchar({ length: 255 }),
    country: varchar({ length: 255 }),
    visitedAt: timestamp("visited_at").notNull().defaultNow(),
});
