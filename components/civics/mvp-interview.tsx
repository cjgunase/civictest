"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import type { SessionView } from "@/lib/domain/civics";

type SpeechRecognitionConstructor = new () => SpeechRecognition;

type SpeechRecognition = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionEvent = {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
};

type SpeechRecognitionErrorEvent = {
  error: string;
};

declare global {
  interface Window {
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
    SpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export function MvpInterview() {
  const [session, setSession] = useState<SessionView | null>(null);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [micStatus, setMicStatus] = useState<"prompt" | "granted" | "denied">("prompt");
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  const speechSupported = useMemo(
    () => typeof window !== "undefined" && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition),
    []
  );

  async function startSession(): Promise<void> {
    setBusy(true);
    setError(null);

    try {
      const response = await fetch("/api/sessions", { method: "POST" });
      const payload = (await response.json()) as { session?: SessionView; error?: string };

      if (!response.ok || !payload.session) {
        throw new Error(payload.error ?? "Unable to start session.");
      }

      setSession(payload.session);
      setDraft("");
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Unable to start session.";
      setError(message);
    } finally {
      setBusy(false);
    }
  }

  async function submitAnswer(): Promise<void> {
    if (!session || !session.currentQuestion) {
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const response = await fetch(`/api/sessions/${session.id}/answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transcript: draft }),
      });

      const payload = (await response.json()) as { session?: SessionView; error?: string };

      if (!response.ok || !payload.session) {
        throw new Error(payload.error ?? "Unable to submit answer.");
      }

      setSession(payload.session);
      setDraft("");
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Unable to submit answer.";
      setError(message);
    } finally {
      setBusy(false);
    }
  }

  async function captureVoice(): Promise<void> {
    if (!speechSupported) {
      setError("Speech recognition is not available in this browser. Use typed fallback.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setMicStatus("granted");
    } catch {
      setMicStatus("denied");
      setError("Microphone permission denied. Continue with typed fallback.");
      return;
    }

    const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Recognition) {
      setError("Speech recognition constructor missing. Use typed fallback.");
      return;
    }

    const recognition = new Recognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      setDraft((prev) => [prev, transcript].filter(Boolean).join(" ").trim());
    };

    recognition.onerror = (event) => {
      if (event.error === "not-allowed") {
        setMicStatus("denied");
      }
      setError(`Voice capture failed (${event.error}). Continue with typed fallback.`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    setIsListening(true);
    recognition.start();
  }

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-6 rounded-xl border border-border bg-card p-5 sm:p-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-card-foreground">Civics Mock Interview (MVP)</h1>
        <p className="text-sm text-muted-foreground">
          Voice-first with typed fallback. Stop rules: pass at 12 correct, fail at 9 incorrect, max 20 questions.
        </p>
      </div>

      {!session ? (
        <div className="flex flex-wrap gap-3">
          <Button onClick={startSession} disabled={busy}>
            {busy ? "Starting..." : "Start Interview"}
          </Button>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="rounded-lg border border-border bg-background p-4 text-sm">
            <p className="font-medium">Officer Intro</p>
            <p className="mt-1 text-muted-foreground">{session.introScript}</p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="rounded-lg border border-border p-3">Asked: {session.progress.asked}</div>
            <div className="rounded-lg border border-border p-3">Correct: {session.progress.correct}</div>
            <div className="rounded-lg border border-border p-3">Incorrect: {session.progress.incorrect}</div>
          </div>

          {session.stopReason ? (
            <div className="rounded-lg border border-border bg-secondary p-4 text-sm">
              Session complete. Stop reason: <span className="font-medium">{session.stopReason}</span>
            </div>
          ) : (
            <>
              <div className="rounded-lg border border-border p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Current question</p>
                <p className="mt-2 text-base">{session.currentQuestion?.prompt}</p>
                {session.currentQuestion?.isDynamicOfficial ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Dynamic answer: can change over time. Last updated: {session.currentQuestion.dynamicLastUpdated ?? "unknown"}.
                  </p>
                ) : null}
              </div>

              <div className="space-y-3">
                <label htmlFor="transcript" className="block text-sm font-medium">
                  Transcript / typed answer
                </label>
                <textarea
                  id="transcript"
                  className="min-h-24 w-full rounded-lg border border-input bg-background p-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Speak and capture transcript, or type your answer here."
                />

                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" onClick={captureVoice} disabled={busy || isListening}>
                    {isListening ? "Listening..." : "Capture Voice"}
                  </Button>
                  <Button onClick={submitAnswer} disabled={busy || !session.currentQuestion}>
                    {busy ? "Submitting..." : "Submit Answer"}
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground">
                  Mic status: {micStatus}. If denied or unsupported, continue using typed fallback.
                </p>
              </div>
            </>
          )}

          {session.lastAttempt ? (
            <div className="rounded-lg border border-border p-4 text-sm">
              <p className="font-medium">Last decision</p>
              <p>Verdict: {session.lastAttempt.verdict}</p>
              <p>Confidence: {session.lastAttempt.confidence.toFixed(2)}</p>
              <p>Grader: {session.lastAttempt.graderVersion}</p>
              <p className="text-muted-foreground">{session.lastAttempt.reason}</p>
            </div>
          ) : null}
        </div>
      )}

      {error ? <p className="rounded-lg border border-destructive/30 p-3 text-sm text-destructive">{error}</p> : null}
    </section>
  );
}
