export const PASS_THRESHOLD = 12;
export const FAIL_THRESHOLD = 9;
export const MAX_QUESTIONS = 20;

export type StopReason =
  | "PASS_REACHED_12"
  | "FAIL_REACHED_9"
  | "MAX_20_REACHED"
  | "ABANDONED";

export type Verdict = "CORRECT" | "INCORRECT" | "UNCERTAIN";

export type DynamicType = "PRESIDENT" | "SENATOR" | "REPRESENTATIVE" | "GOVERNOR";

export type CivicsQuestion = {
  id: string;
  prompt: string;
  acceptedAnswers: string[];
  isDynamicOfficial: boolean;
  dynamicType?: DynamicType;
};

export type DynamicOfficialRecord = {
  type: DynamicType;
  value: string;
  lastUpdated: string;
  updatedBy: string;
};

export type DynamicOfficialsSnapshot = {
  records: DynamicOfficialRecord[];
  snapshotVersion: string;
};

export type SessionAttempt = {
  questionId: string;
  prompt: string;
  transcript: string;
  normalizedTranscript: string;
  verdict: Verdict;
  confidence: number;
  graderVersion: string;
  reason: string;
  acceptedByVariant?: string;
  dynamicSnapshot?: DynamicOfficialsSnapshot;
  createdAt: string;
};

export type SessionState = {
  id: string;
  userId: string;
  asked: number;
  correct: number;
  incorrect: number;
  stopReason: StopReason | null;
  startedAt: string;
  endedAt: string | null;
  questionOrder: string[];
  currentQuestionIndex: number;
  attempts: SessionAttempt[];
};

export type SessionProgress = {
  asked: number;
  correct: number;
  incorrect: number;
  remainingBeforeMax: number;
};

export type SessionQuestionView = {
  id: string;
  prompt: string;
  isDynamicOfficial: boolean;
  dynamicType?: DynamicType;
  dynamicLastUpdated?: string;
};

export type SessionView = {
  id: string;
  progress: SessionProgress;
  stopReason: StopReason | null;
  introScript: string;
  currentQuestion: SessionQuestionView | null;
  lastAttempt: SessionAttempt | null;
};
