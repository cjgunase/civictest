"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Mic, MicOff, Square, Loader2, RotateCcw, CheckCircle, XCircle, ChevronDown, ChevronUp, Trophy, AlertTriangle, PlayCircle, Fingerprint, BookOpen, Users, ClipboardCheck, Scale, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { submitVoiceAnswer, fetchSession, createNewSession } from "@/app/actions/interview";
import type { SessionView, SessionAttempt } from "@/lib/domain/civics";
import { loadTtsManifest, getStaticAudioUrl, type TtsManifest } from "@/lib/tts-manifest";

// ─── Overview Screen ────────────────────────────────────────────────────────
function OverviewScreen({ onStart }: { onStart: () => void }) {
    return (
        <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto pb-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="text-center space-y-3">
                <h1 className="text-4xl font-black text-[#002868] drop-shadow-sm" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    Your Naturalization Interview
                </h1>
                <p className="text-lg text-gray-600 font-medium max-w-2xl mx-auto">
                    A comprehensive guide from the start of your day to the end. Follow these steps to become a U.S. citizen.
                </p>
            </div>

            {/* What to Bring */}
            <div className="bg-white rounded-2xl p-7 border-2 shadow-sm border-[#002868]/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_top_right,rgba(178,34,52,0.1)_0%,transparent_70%)]" />
                <div className="flex items-center gap-3 mb-5">
                    <FileText className="w-6 h-6 text-[#B22234]" />
                    <h2 className="text-xl font-bold text-[#002868]">What to Bring</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-3 text-gray-700">
                    {[
                        "Interview appointment notice",
                        "Permanent Resident Card (\"Green Card\")",
                        "Passports (valid and expired)",
                        "State-issued identification",
                        "Supporting documents (marriage certs, tax returns, etc.)"
                    ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3 bg-[#F8F5EE] p-3 rounded-xl border border-gray-100">
                            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="font-medium text-sm leading-snug">{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Timeline */}
            <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                    <Users className="w-6 h-6 text-[#002868]" />
                    <h2 className="text-xl font-bold text-[#002868]">Key Stages of the Interview</h2>
                </div>

                <div className="space-y-4">
                    {[
                        { icon: <Fingerprint />, title: "1. Arrival and Check-in", desc: "Pass through security, present your interview notice, and have your photo and fingerprints taken." },
                        { icon: <Scale />, title: "2. The Oath", desc: "The officer will ask you to swear or affirm that you will tell the truth." },
                        { icon: <ClipboardCheck />, title: "3. Background & N-400 Review", desc: "The officer will review your application line-by-line, confirming your identity, history, and moral character." },
                        { icon: <BookOpen />, title: "4. The Civics Test", desc: "Answer 6 out of 10 questions correctly from a pool of 100 on U.S. history and government." },
                        { icon: <Mic />, title: "5. The English Test", desc: "Speaking is assessed throughout. Reading/Writing: Correctly read and write one sentence." },
                        { icon: <CheckCircle />, title: "6. Conclusion", desc: "The officer will ask you to sign your application and the oath of allegiance." },
                    ].map((stage, i) => (
                        <div key={i} className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 rounded-full border-2 border-[#002868]/20 bg-white flex items-center justify-center text-[#002868] shadow-sm z-10">
                                    {stage.icon}
                                </div>
                                {i !== 5 && <div className="w-0.5 h-full bg-gradient-to-b from-[#002868]/20 to-transparent my-1" />}
                            </div>
                            <div className="bg-white rounded-2xl p-5 border shadow-sm border-gray-200 flex-1 mb-2 hover:border-[#002868]/30 transition-colors">
                                <h3 className="text-lg font-bold text-[#002868] mb-1">{stage.title}</h3>
                                <p className="text-gray-600 font-medium text-sm leading-relaxed">{stage.desc}</p>
                                {i === 1 && (
                                    <div className="mt-4 rounded-xl overflow-hidden shadow-md border-2 border-gray-100 bg-gray-50 aspect-video relative">
                                        <iframe
                                            className="absolute top-0 left-0 w-full h-full"
                                            src="https://www.youtube.com/embed/MHjOVa6HGHI"
                                            title="USCIS Naturalization Interview Video - The Oath"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                )}
                                {i === 2 && (
                                    <div className="mt-4 rounded-xl overflow-hidden shadow-md border-2 border-gray-100 bg-gray-50 aspect-video relative">
                                        <iframe
                                            className="absolute top-0 left-0 w-full h-full"
                                            src="https://www.youtube.com/embed/mS8s8JFUhVw?start=13"
                                            title="USCIS Naturalization Interview Video - Background Review"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                )}
                                {i === 3 && (
                                    <div className="mt-5 pt-4 border-t border-gray-100 flex justify-start">
                                        <Button
                                            size="lg"
                                            onClick={onStart}
                                            className="w-full sm:w-auto px-8 h-14 rounded-xl font-bold text-base shadow-xl shadow-[#B22234]/20 transition-all hover:-translate-y-1 active:scale-95 group flex items-center justify-center"
                                            style={{ background: "#B22234", color: "white" }}
                                        >
                                            <PlayCircle className="w-5 h-5 mr-2.5 group-hover:animate-pulse" />
                                            Start Civics Test
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* After the Interview */}
            <div className="bg-gradient-to-br from-[#002868] to-[#001f52] rounded-2xl p-8 text-white relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 py-1.5 w-full text-right overflow-hidden opacity-10">
                    <span className="text-[10px] tracking-[8px]">★ ★ ★ ★ ★ ★ ★ ★ ★ ★</span>
                </div>
                <div className="flex items-center gap-3 mb-6 relative z-10">
                    <Trophy className="w-6 h-6 text-[#E8C97A]" />
                    <h2 className="text-xl font-bold">After the Interview</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 relative z-10">
                    <div className="bg-white/10 p-5 rounded-xl border border-white/20 backdrop-blur-sm">
                        <h3 className="text-[#E8C97A] font-bold text-lg mb-2">The Result</h3>
                        <p className="text-white/80 text-sm font-medium leading-relaxed">
                            You may be approved, continued (for more documents or a second interview), or denied.
                        </p>
                    </div>
                    <div className="bg-white/10 p-5 rounded-xl border border-white/20 backdrop-blur-sm">
                        <h3 className="text-[#E8C97A] font-bold text-lg mb-2">Oath Ceremony</h3>
                        <p className="text-white/80 text-sm font-medium leading-relaxed">
                            If approved, you will receive a notice for your ceremony, where you will take the Oath of Allegiance.
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}

// ─── Results Screen ─────────────────────────────────────────────────────────

function ResultsScreen({ session, onRetake }: { session: SessionView; onRetake: () => void }) {
    const passed = session.stopReason === "PASS_REACHED_12";
    const [expanded, setExpanded] = useState<string | null>(null);
    const scorePercent = session.progress.asked > 0 ? Math.round((session.progress.correct / session.progress.asked) * 100) : 0;

    return (
        <div className="flex flex-col gap-6 w-full">
            {/* Result Banner */}
            <div
                className="rounded-2xl p-7 text-center relative overflow-hidden border-2"
                style={{
                    background: passed
                        ? "linear-gradient(135deg, #002868 0%, #001f52 100%)"
                        : "linear-gradient(135deg, #8B1A27 0%, #B22234 100%)",
                    borderColor: passed ? "#002868" : "#B22234",
                }}
            >
                <div className="absolute top-0 left-0 right-0 py-1.5 overflow-hidden">
                    <span className="text-white/15 text-[10px] tracking-[8px]">★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★</span>
                </div>
                <div className="flex items-center justify-center w-20 h-20 rounded-full mx-auto mb-5 mt-2"
                    style={{ background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.3)" }}
                >
                    {passed
                        ? <Trophy className="w-10 h-10 text-[#E8C97A]" />
                        : <AlertTriangle className="w-10 h-10 text-white" />
                    }
                </div>
                <h2
                    className="text-3xl font-black text-white mb-3"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                    {passed ? "🎉 You Passed!" : "Keep Practicing!"}
                </h2>
                <p className="text-base text-white/80 mb-7 leading-relaxed">
                    {passed
                        ? "Congratulations! You demonstrated strong knowledge of U.S. civics."
                        : "Review the questions below and retake the interview to improve your score."}
                </p>

                {/* Score Grid */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { val: session.progress.asked, label: "Questions Asked", color: "white" },
                        { val: session.progress.correct, label: "Correct ✓", color: "#6EE7B7" },
                        { val: session.progress.incorrect, label: "Incorrect ✗", color: "#FCA5A5" },
                    ].map((s) => (
                        <div key={s.label} className="bg-white/10 rounded-xl p-4 border border-white/20">
                            <div
                                className="text-3xl font-black mb-1"
                                style={{ color: s.color, fontFamily: "'Playfair Display', Georgia, serif" }}
                            >
                                {s.val}
                            </div>
                            <div className="text-xs font-semibold text-white/70 uppercase tracking-wider">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Score bar */}
                <div className="mt-5">
                    <div className="flex justify-between text-sm font-bold text-white/80 mb-2">
                        <span>Score</span>
                        <span>{scorePercent}% — Need 60% to pass</span>
                    </div>
                    <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-1000"
                            style={{
                                width: `${scorePercent}%`,
                                background: passed ? "#E8C97A" : "#FCA5A5",
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Question Review */}
            {(session.allAttempts ?? []).length > 0 && (
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                        <div className="h-0.5 w-4 bg-[#B22234]" />
                        <h3 className="text-sm font-black text-[#002868] uppercase tracking-widest">Question Review</h3>
                        <div className="flex-1 h-px bg-[#002868]/15" />
                    </div>
                    {(session.allAttempts ?? []).map((attempt, idx) => (
                        <AttemptCard
                            key={attempt.questionId}
                            attempt={attempt}
                            index={idx + 1}
                            isExpanded={expanded === attempt.questionId}
                            onToggle={() => setExpanded(expanded === attempt.questionId ? null : attempt.questionId)}
                        />
                    ))}
                </div>
            )}

            {/* Retake Button */}
            <Button
                onClick={onRetake}
                className="w-full h-14 rounded-xl font-bold text-base shadow-lg transition-all active:scale-95"
                style={{ background: "#002868", color: "white" }}
            >
                <RotateCcw className="w-5 h-5 mr-2" />
                Retake Interview
            </Button>
        </div>
    );
}

function AttemptCard({ attempt, index, isExpanded, onToggle }: {
    attempt: SessionAttempt;
    index: number;
    isExpanded: boolean;
    onToggle: () => void;
}) {
    const isCorrect = attempt.verdict === "CORRECT";
    return (
        <div
            className={`rounded-xl border-2 cursor-pointer transition-all ${isCorrect
                ? "border-emerald-200 bg-emerald-50 hover:border-emerald-400"
                : "border-red-200 bg-red-50 hover:border-[#B22234]"
                }`}
            onClick={onToggle}
        >
            <div className="flex items-start gap-4 p-5">
                {isCorrect
                    ? <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    : <XCircle className="w-5 h-5 text-[#B22234] mt-0.5 flex-shrink-0" />
                }
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-400 mb-1">Question {index}</p>
                    <p className="text-base text-gray-800 font-semibold leading-snug">{attempt.prompt}</p>
                </div>
                <div className="flex-shrink-0 text-gray-400">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
            </div>
            {isExpanded && (
                <div className="px-5 pb-5 border-t-2 border-dashed border-gray-200 pt-4 flex flex-col gap-3">
                    <div>
                        <span className="text-sm font-bold text-gray-500">Your answer: </span>
                        <span className={`text-base font-semibold ${isCorrect ? "text-emerald-600" : "text-[#B22234]"}`}>
                            {attempt.transcript || <em className="opacity-50">No answer given</em>}
                        </span>
                    </div>
                    {!isCorrect && (attempt.acceptedAnswers ?? []).length > 0 && (
                        <div>
                            <p className="text-sm font-bold text-gray-500 mb-2">Accepted answers:</p>
                            <div className="flex flex-wrap gap-2">
                                {(attempt.acceptedAnswers ?? []).slice(0, 5).map((ans) => (
                                    <span
                                        key={ans}
                                        className="text-sm font-medium border-2 px-3 py-1 rounded-lg"
                                        style={{ background: "#F0FFF4", borderColor: "#22c55e", color: "#166534" }}
                                    >
                                        {ans}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ─── Main Interview Simulator ─────────────────────────────────────────────────

export default function InterviewSimulator() {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [session, setSession] = useState<SessionView | null>(null);
    const [questionAudioUrl, setQuestionAudioUrl] = useState<string | null>(null);
    const [phase, setPhase] = useState<"overview" | "loading" | "intro" | "interview" | "done">("overview");
    const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
    const [ttsManifest, setTtsManifest] = useState<TtsManifest>({});

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const rafRef = useRef<number | null>(null);
    const [volume, setVolume] = useState(0);

    useEffect(() => {
        loadTtsManifest().then(setTtsManifest);
    }, []);

    const queueTTS = useCallback(
        (text: string, clipKey?: string) => {
            setQuestionAudioUrl(null);
            const staticUrl = clipKey ? getStaticAudioUrl(ttsManifest, clipKey) : null;
            const url = staticUrl ?? `/api/tts?text=${encodeURIComponent(text)}`;
            setTimeout(() => setQuestionAudioUrl(url), 50);
        },
        [ttsManifest]
    );

    const startNewSession = useCallback(async () => {
        setPhase("loading");
        setSession(null);
        setQuestionAudioUrl(null);
        try {
            const sess = await createNewSession();
            setSession(sess);
            setPhase("intro");
            queueTTS(sess.introScript, "intro");
        } catch {
            toast.error("Could not start interview session.");
        }
    }, [queueTTS]);

    // Removed auto-start, now triggered by button in overview phase


    const beginInterview = useCallback(() => {
        if (!session) return;
        setPhase("interview");
        if (session.currentQuestion) {
            setCurrentQuestion(session.currentQuestion.prompt);
            queueTTS(session.currentQuestion.prompt, session.currentQuestion.id);
        }
    }, [session, queueTTS]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
            analyserRef.current = audioContextRef.current.createAnalyser();
            const source = audioContextRef.current.createMediaStreamSource(stream);
            source.connect(analyserRef.current);
            analyserRef.current.fftSize = 256;

            const bufferLength = analyserRef.current.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const updateVolume = () => {
                if (!analyserRef.current) return;
                analyserRef.current.getByteFrequencyData(dataArray);
                const avg = dataArray.reduce((acc, val) => acc + val, 0) / bufferLength;
                setVolume(avg);
                rafRef.current = requestAnimationFrame(updateVolume);
            };

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) audioChunksRef.current.push(event.data);
            };
            mediaRecorder.onstart = () => {
                setIsRecording(true);
                updateVolume();
            };
            mediaRecorder.onstop = async () => {
                setIsRecording(false);
                setIsProcessing(true);
                setVolume(0);
                if (rafRef.current) cancelAnimationFrame(rafRef.current);

                const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                const reader = new FileReader();
                reader.readAsDataURL(audioBlob);
                reader.onloadend = async () => {
                    const base64data = reader.result?.toString().split(",")[1];
                    if (!base64data) { setIsProcessing(false); return; }
                    try {
                        const res = await submitVoiceAnswer({ sessionId: session!.id, audioBase64: base64data });
                        setSession(res.session);
                        toast.success(`Heard: "${res.transcript}"`);
                        if (res.session.stopReason) {
                            setPhase("done");
                            const isPassed = res.session.stopReason === "PASS_REACHED_12";
                            const endMsg = isPassed
                                ? "Congratulations! You have passed the civics test!"
                                : "The interview is now complete. Please review your results.";
                            queueTTS(endMsg, isPassed ? "pass_end" : "fail_end");
                        } else if (res.session.currentQuestion) {
                            setCurrentQuestion(res.session.currentQuestion.prompt);
                            queueTTS(res.session.currentQuestion.prompt, res.session.currentQuestion.id);
                        }
                    } catch {
                        toast.error("Failed to grade answer.");
                    } finally {
                        setIsProcessing(false);
                    }
                };
                stream.getTracks().forEach((t) => t.stop());
            };
            mediaRecorder.start();
        } catch {
            toast.error("Microphone access denied or unavailable.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            audioContextRef.current?.close();
        }
    };

    const visualizerScale = Math.max(1, 1 + volume / 80);

    // ── Overview ─────────────────────────────────────────────────────────────
    if (phase === "overview") {
        return <OverviewScreen onStart={startNewSession} />;
    }

    // ── Loading ──────────────────────────────────────────────────────────────
    if (phase === "loading") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-5">
                <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #002868 0%, #001f52 100%)" }}
                >
                    <Loader2 className="w-8 h-8 animate-spin text-white" />
                </div>
                <p className="text-lg font-semibold text-[#002868]">Preparing your interview...</p>
                <p className="text-base text-gray-500">Setting up your USCIS civics session</p>
            </div>
        );
    }

    // ── Done (Results) ───────────────────────────────────────────────────────
    if (phase === "done" && session) {
        return (
            <div className="pb-12">
                {questionAudioUrl && <audio src={questionAudioUrl} autoPlay className="hidden" />}
                <ResultsScreen session={session} onRetake={startNewSession} />
            </div>
        );
    }

    // ── Intro / Interview ────────────────────────────────────────────────────
    return (
        <div className="flex flex-col items-center gap-7 w-full max-w-lg mx-auto">
            {questionAudioUrl && (
                <audio
                    src={questionAudioUrl}
                    autoPlay
                    onEnded={() => { if (phase === "intro") beginInterview(); }}
                    className="hidden"
                />
            )}

            {/* Officer Card */}
            <div
                className="w-full rounded-2xl p-5 text-center relative overflow-hidden border-2"
                style={{ background: "linear-gradient(135deg, #002868 0%, #001f52 100%)", borderColor: "#002868" }}
            >
                <div className="absolute top-0 left-0 right-0 py-1.5 overflow-hidden">
                    <span className="text-white/15 text-[10px] tracking-[8px]">★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★</span>
                </div>
                <div
                    className={`text-sm font-bold uppercase tracking-widest mt-2 transition-colors ${isRecording ? "text-red-300" : isProcessing ? "text-blue-300" : "text-white/60"
                        }`}
                >
                    {phase === "intro" ? "🎙️ Officer Speaking..." : isProcessing ? "⏳ Analyzing..." : isRecording ? "🔴 Listening..." : "🟢 Ready"}
                </div>

                {/* Visualizer */}
                <div className="relative w-44 h-44 flex items-center justify-center mx-auto my-4">
                    <div
                        className={`absolute inset-0 rounded-full border-2 opacity-20 transition-transform duration-100 ${isRecording ? "border-red-400" : "border-white"
                            }`}
                        style={{ transform: `scale(${visualizerScale * 1.5})` }}
                    />
                    <div
                        className={`absolute inset-5 rounded-full border opacity-30 transition-transform duration-100 ${isRecording ? "border-red-300" : "border-white/50"
                            }`}
                        style={{ transform: `scale(${visualizerScale * 1.2})` }}
                    />
                    <div
                        className={`w-28 h-28 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${isRecording
                            ? "border-red-300 bg-red-900/30 shadow-[0_0_32px_rgba(178,34,52,0.6)]"
                            : isProcessing
                                ? "border-blue-300 bg-blue-900/30 animate-pulse"
                                : "border-white/30 bg-white/10"
                            }`}
                    >
                        {isRecording
                            ? <Mic className="w-10 h-10 text-red-300" />
                            : isProcessing
                                ? <Loader2 className="w-10 h-10 text-blue-300 animate-spin" />
                                : <MicOff className="w-10 h-10 text-white/50" />
                        }
                    </div>
                </div>
                <p className="text-sm text-white/50 font-medium">USCIS Civics Interview Simulator</p>
            </div>

            {/* Current Question */}
            {phase === "interview" && currentQuestion && (
                <div className="w-full rounded-2xl border-2 bg-white px-7 py-6 shadow-lg" style={{ borderColor: "#002868" }}>
                    <div className="text-sm font-black text-[#B22234] uppercase tracking-widest mb-3">
                        🏛️ Officer&apos;s Question
                    </div>
                    <p className="text-xl text-gray-900 font-bold leading-relaxed">{currentQuestion}</p>
                </div>
            )}

            {/* Controls */}
            <div className="flex w-full justify-center">
                {phase === "interview" && (
                    isRecording ? (
                        <Button
                            size="lg"
                            className="w-full max-w-xs h-14 rounded-xl font-bold text-base shadow-lg transition-all active:scale-95"
                            style={{ background: "#B22234", color: "white" }}
                            onClick={stopRecording}
                        >
                            <Square className="w-5 h-5 mr-2" /> Stop Answering
                        </Button>
                    ) : (
                        <Button
                            size="lg"
                            className={`w-full max-w-xs h-14 rounded-xl font-bold text-base transition-all ${isProcessing
                                ? "opacity-50 pointer-events-none bg-gray-100 text-gray-400 border-2 border-gray-200"
                                : "shadow-lg active:scale-95"
                                }`}
                            style={isProcessing ? {} : { background: "#002868", color: "white" }}
                            onClick={startRecording}
                            disabled={isProcessing}
                        >
                            {isProcessing
                                ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Processing…</>
                                : <><Mic className="w-5 h-5 mr-2" />Tap to Answer</>
                            }
                        </Button>
                    )
                )}
                {phase === "intro" && (
                    <Button
                        size="lg"
                        className="w-full max-w-xs h-14 rounded-xl font-bold text-base shadow-lg transition-all active:scale-95"
                        style={{ background: "#002868", color: "white" }}
                        onClick={beginInterview}
                    >
                        Skip to Interview →
                    </Button>
                )}
            </div>

            {/* Progress Bar */}
            {phase === "interview" && session && (
                <div className="w-full bg-white rounded-xl p-5 border-2 shadow-sm" style={{ borderColor: "#002868" }}>
                    <div className="flex justify-between text-sm font-bold mb-3">
                        <span className="text-[#002868]">Question {session.progress.asked + 1} of up to 20</span>
                        <span className="flex gap-4">
                            <span className="text-emerald-600">✓ {session.progress.correct}</span>
                            <span className="text-[#B22234]">✗ {session.progress.incorrect}</span>
                        </span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                                width: `${(session.progress.asked / 20) * 100}%`,
                                background: "linear-gradient(90deg, #002868 0%, #4a78c8 50%, #B22234 100%)",
                            }}
                        />
                    </div>
                    <p className="text-xs text-gray-400 mt-2 font-medium">Pass: answer 6 of 10 correctly</p>
                </div>
            )}
        </div>
    );
}
