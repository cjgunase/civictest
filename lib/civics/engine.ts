import {
  FAIL_THRESHOLD,
  MAX_QUESTIONS,
  PASS_THRESHOLD,
  type CivicsQuestion,
  type SessionAttempt,
  type SessionQuestionView,
  type SessionState,
  type SessionView,
  type StopReason,
} from "@/lib/domain/civics";
import { getDynamicOfficial, getDynamicSnapshot } from "@/lib/civics/dynamic-officials";
import { gradeDeterministic, GRADER_VERSION, resolveVerdictForMvp } from "@/lib/civics/grading";
import type { Verdict } from "@/lib/domain/civics";

export const INTRO_SCRIPT =
  "Good morning. I am your USCIS officer. I will ask you up to 20 civics questions today. You must answer at least 12 correctly to pass. Let's begin.";

export function computeStopReason(params: { asked: number; correct: number; incorrect: number }): StopReason | null {
  if (params.correct >= PASS_THRESHOLD) return "PASS_REACHED_12";
  if (params.incorrect >= FAIL_THRESHOLD) return "FAIL_REACHED_9";
  if (params.asked >= MAX_QUESTIONS) return "MAX_20_REACHED";
  return null;
}

function resolveAcceptedAnswers(question: CivicsQuestion): {
  acceptedVariants: string[];
  dynamicLastUpdated?: string;
  dynamicSnapshot?: ReturnType<typeof getDynamicSnapshot>;
} {
  if (!question.isDynamicOfficial || !question.dynamicType) {
    return { acceptedVariants: question.acceptedAnswers };
  }
  const current = getDynamicOfficial(question.dynamicType);
  if (!current) return { acceptedVariants: [] };
  return {
    acceptedVariants: [current.value, current.value.toLowerCase(), current.value.split(" ").at(-1) ?? current.value],
    dynamicLastUpdated: current.lastUpdated,
    dynamicSnapshot: getDynamicSnapshot(),
  };
}

export function nextQuestion(state: SessionState, questionBankById: Map<string, CivicsQuestion>): SessionQuestionView | null {
  if (state.stopReason) return null;
  const questionId = state.questionOrder[state.currentQuestionIndex];
  if (!questionId) return null;
  const question = questionBankById.get(questionId);
  if (!question) return null;
  const resolved = resolveAcceptedAnswers(question);
  return {
    id: question.id,
    prompt: question.prompt,
    isDynamicOfficial: question.isDynamicOfficial,
    dynamicType: question.dynamicType,
    dynamicLastUpdated: resolved.dynamicLastUpdated,
    acceptedAnswers: question.isDynamicOfficial ? resolved.acceptedVariants : question.acceptedAnswers,
  };
}

export function createSessionView(state: SessionState, questionBankById: Map<string, CivicsQuestion>): SessionView {
  return {
    id: state.id,
    progress: {
      asked: state.asked,
      correct: state.correct,
      incorrect: state.incorrect,
      remainingBeforeMax: Math.max(0, MAX_QUESTIONS - state.asked),
    },
    stopReason: state.stopReason,
    introScript: INTRO_SCRIPT,
    currentQuestion: nextQuestion(state, questionBankById),
    lastAttempt: state.attempts.at(-1) ?? null,
    allAttempts: state.attempts,
  };
}

export async function submitAnswer(params: {
  state: SessionState;
  question: CivicsQuestion;
  transcript: string;
  fallbackGrader?: (transcript: string, question: string, acceptedAnswers: string[]) => Promise<{ verdict: Verdict; reason: string }>;
}): Promise<{ state: SessionState; attempt: SessionAttempt }> {
  if (params.state.stopReason) throw new Error("Session already complete.");

  const resolved = resolveAcceptedAnswers(params.question);
  const grading = gradeDeterministic({ transcript: params.transcript, question: params.question, acceptedVariants: resolved.acceptedVariants });

  let finalVerdict = grading.verdict;
  let finalReason = grading.reason;

  if (finalVerdict === "UNCERTAIN") {
    if (params.fallbackGrader) {
      const fallbackResult = await params.fallbackGrader(params.transcript, params.question.prompt, resolved.acceptedVariants);
      finalVerdict = fallbackResult.verdict;
      finalReason = fallbackResult.reason;
    } else {
      finalVerdict = resolveVerdictForMvp(grading.verdict);
      finalReason = `${grading.reason} Fallback unresolved; treated as incorrect.`;
    }
  }

  const attempt: SessionAttempt = {
    questionId: params.question.id,
    prompt: params.question.prompt,
    transcript: params.transcript,
    normalizedTranscript: grading.normalizedTranscript,
    verdict: finalVerdict,
    confidence: grading.confidence,
    graderVersion: GRADER_VERSION,
    reason: finalReason,
    acceptedByVariant: grading.acceptedByVariant,
    acceptedAnswers: params.question.isDynamicOfficial ? resolved.acceptedVariants : params.question.acceptedAnswers,
    dynamicSnapshot: params.question.isDynamicOfficial ? resolved.dynamicSnapshot : undefined,
    createdAt: new Date().toISOString(),
  };

  const asked = params.state.asked + 1;
  const correct = params.state.correct + (attempt.verdict === "CORRECT" ? 1 : 0);
  const incorrect = params.state.incorrect + (attempt.verdict === "INCORRECT" ? 1 : 0);
  const stopReason = computeStopReason({ asked, correct, incorrect });

  const nextState: SessionState = {
    ...params.state,
    asked,
    correct,
    incorrect,
    stopReason,
    endedAt: stopReason ? new Date().toISOString() : null,
    currentQuestionIndex: params.state.currentQuestionIndex + 1,
    attempts: [...params.state.attempts, attempt],
  };

  return { state: nextState, attempt };
}
