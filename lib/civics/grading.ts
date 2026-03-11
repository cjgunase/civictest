import type { CivicsQuestion, SessionAttempt, Verdict } from "@/lib/domain/civics";

export const GRADER_VERSION = "deterministic-v1";

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenSet(value: string): Set<string> {
  return new Set(normalize(value).split(" ").filter(Boolean));
}

function overlapScore(answer: string, variant: string): number {
  const answerTokens = tokenSet(answer);
  const variantTokens = tokenSet(variant);

  if (answerTokens.size === 0 || variantTokens.size === 0) {
    return 0;
  }

  let overlap = 0;
  for (const token of answerTokens) {
    if (variantTokens.has(token)) {
      overlap += 1;
    }
  }

  const precision = overlap / answerTokens.size;
  const recall = overlap / variantTokens.size;
  return (precision + recall) / 2;
}

export function normalizeTranscript(transcript: string): string {
  return normalize(transcript);
}

export function gradeDeterministic(params: {
  transcript: string;
  question: CivicsQuestion;
  acceptedVariants: string[];
}): Pick<SessionAttempt, "normalizedTranscript" | "verdict" | "confidence" | "reason" | "acceptedByVariant"> {
  const normalizedTranscript = normalizeTranscript(params.transcript);

  if (!normalizedTranscript) {
    return {
      normalizedTranscript,
      verdict: "INCORRECT",
      confidence: 1,
      reason: "Empty transcript.",
    };
  }

  let bestVariant = "";
  let bestScore = 0;

  for (const variant of params.acceptedVariants) {
    const exact = normalize(variant) === normalizedTranscript;
    if (exact) {
      return {
        normalizedTranscript,
        verdict: "CORRECT",
        confidence: 1,
        reason: "Exact canonical variant match.",
        acceptedByVariant: variant,
      };
    }

    const score = overlapScore(params.transcript, variant);
    if (score > bestScore) {
      bestScore = score;
      bestVariant = variant;
    }
  }

  if (bestScore >= 0.78) {
    return {
      normalizedTranscript,
      verdict: "CORRECT",
      confidence: Math.min(0.95, bestScore),
      reason: "High-overlap deterministic match.",
      acceptedByVariant: bestVariant,
    };
  }

  if (bestScore >= 0.55) {
    return {
      normalizedTranscript,
      verdict: "UNCERTAIN",
      confidence: bestScore,
      reason: "Needs fallback grader for semantic equivalence.",
      acceptedByVariant: bestVariant,
    };
  }

  return {
    normalizedTranscript,
    verdict: "INCORRECT",
    confidence: 1 - bestScore,
    reason: "No deterministic match.",
  };
}

export function resolveVerdictForMvp(verdict: Verdict): Verdict {
  // MVP does not include LLM fallback wiring yet; uncertain defaults to incorrect.
  return verdict === "UNCERTAIN" ? "INCORRECT" : verdict;
}
