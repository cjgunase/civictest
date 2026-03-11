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

export const INTRO_SCRIPT =
  "I am conducting your civics test. I will ask up to 20 questions. I will stop when you pass or fail.";

export function computeStopReason(params: {
  asked: number;
  correct: number;
  incorrect: number;
}): StopReason | null {
  if (params.correct >= PASS_THRESHOLD) {
    return "PASS_REACHED_12";
  }

  if (params.incorrect >= FAIL_THRESHOLD) {
    return "FAIL_REACHED_9";
  }

  if (params.asked >= MAX_QUESTIONS) {
    return "MAX_20_REACHED";
  }

  return null;
}

function resolveAcceptedAnswers(question: CivicsQuestion): {
  acceptedVariants: string[];
  dynamicLastUpdated?: string;
  dynamicSnapshot?: ReturnType<typeof getDynamicSnapshot>;
} {
  if (!question.isDynamicOfficial || !question.dynamicType) {
    return {
      acceptedVariants: question.acceptedAnswers,
    };
  }

  const current = getDynamicOfficial(question.dynamicType);

  if (!current) {
    return {
      acceptedVariants: [],
    };
  }

  return {
    acceptedVariants: [current.value],
    dynamicLastUpdated: current.lastUpdated,
    dynamicSnapshot: getDynamicSnapshot(),
  };
}

export function nextQuestion(state: SessionState, questionBankById: Map<string, CivicsQuestion>): SessionQuestionView | null {
  if (state.stopReason) {
    return null;
  }

  const questionId = state.questionOrder[state.currentQuestionIndex];
  if (!questionId) {
    return null;
  }

  const question = questionBankById.get(questionId);
  if (!question) {
    return null;
  }

  const resolved = resolveAcceptedAnswers(question);

  return {
    id: question.id,
    prompt: question.prompt,
    isDynamicOfficial: question.isDynamicOfficial,
    dynamicType: question.dynamicType,
    dynamicLastUpdated: resolved.dynamicLastUpdated,
  };
}

export function createSessionView(
  state: SessionState,
  questionBankById: Map<string, CivicsQuestion>
): SessionView {
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
  };
}

export function submitAnswer(params: {
  state: SessionState;
  question: CivicsQuestion;
  transcript: string;
}): { state: SessionState; attempt: SessionAttempt } {
  if (params.state.stopReason) {
    throw new Error("Session already complete.");
  }

  const resolved = resolveAcceptedAnswers(params.question);
  const grading = gradeDeterministic({
    transcript: params.transcript,
    question: params.question,
    acceptedVariants: resolved.acceptedVariants,
  });
  const finalVerdict = resolveVerdictForMvp(grading.verdict);

  const attempt: SessionAttempt = {
    questionId: params.question.id,
    prompt: params.question.prompt,
    transcript: params.transcript,
    normalizedTranscript: grading.normalizedTranscript,
    verdict: finalVerdict,
    confidence: grading.confidence,
    graderVersion: GRADER_VERSION,
    reason:
      finalVerdict === grading.verdict
        ? grading.reason
        : `${grading.reason} Fallback unresolved in MVP; treated as incorrect.`,
    acceptedByVariant: grading.acceptedByVariant,
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

  return {
    state: nextState,
    attempt,
  };
}
