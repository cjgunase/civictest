import { randomUUID } from "node:crypto";

import { createSessionView, submitAnswer } from "@/lib/civics/engine";
import { QUESTION_BANK } from "@/lib/civics/question-bank";
import type { CivicsQuestion, SessionState, SessionView } from "@/lib/domain/civics";

const byId = new Map<string, SessionState>();
const questionBankById = new Map<string, CivicsQuestion>(QUESTION_BANK.map((item) => [item.id, item]));

function buildQuestionOrder(): string[] {
  const shuffled = [...QUESTION_BANK].sort(() => Math.random() - 0.5);
  return shuffled.map((q) => q.id);
}

function getStateOrThrow(id: string): SessionState {
  const state = byId.get(id);
  if (!state) {
    throw new Error("Session not found.");
  }
  return state;
}

export function startSession(userId: string): SessionView {
  const id = randomUUID();

  const state: SessionState = {
    id,
    userId,
    asked: 0,
    correct: 0,
    incorrect: 0,
    stopReason: null,
    startedAt: new Date().toISOString(),
    endedAt: null,
    questionOrder: buildQuestionOrder(),
    currentQuestionIndex: 0,
    attempts: [],
  };

  byId.set(id, state);

  return createSessionView(state, questionBankById);
}

export function getSessionView(sessionId: string, userId: string): SessionView {
  const state = getStateOrThrow(sessionId);
  if (state.userId !== userId) {
    throw new Error("Forbidden");
  }

  return createSessionView(state, questionBankById);
}

export function answerSession(params: {
  sessionId: string;
  userId: string;
  transcript: string;
}): SessionView {
  const state = getStateOrThrow(params.sessionId);
  if (state.userId !== params.userId) {
    throw new Error("Forbidden");
  }

  const questionId = state.questionOrder[state.currentQuestionIndex];
  const question = questionId ? questionBankById.get(questionId) : null;

  if (!question) {
    throw new Error("No next question available.");
  }

  const updated = submitAnswer({
    state,
    question,
    transcript: params.transcript,
  });

  byId.set(state.id, updated.state);

  return createSessionView(updated.state, questionBankById);
}
