"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, Eye, Shuffle, RotateCcw, CheckCircle, XCircle, Star, BrainCircuit, BarChart3, Clock, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QUESTION_BANK } from "@/lib/civics/question-bank";
import type { CivicsQuestion } from "@/lib/domain/civics";
import { getUserFlashcards, updateFlashcardStat } from "@/app/actions/flashcard";

function shuffle<T>(arr: T[]): T[] {
    return [...arr].sort(() => Math.random() - 0.5);
}

// Extracted from our QUESTION_BANK
const CATEGORIES = Array.from(new Set(QUESTION_BANK.map((q) => q.category).filter(Boolean) as string[]));

export default function PracticeMode() {
    const [mode, setMode] = useState<"setup" | "practice">("setup");
    const [filter, setFilter] = useState<"all" | "65" | "review" | string>("all");
    const [questions, setQuestions] = useState<CivicsQuestion[]>([]);
    const [index, setIndex] = useState(0);
    const [revealed, setRevealed] = useState(false);
    const [marks, setMarks] = useState<Record<string, "correct" | "incorrect">>({});

    // Server state
    const [flashcardStats, setFlashcardStats] = useState<any[]>([]);
    const [isLoadingStats, setIsLoadingStats] = useState(true);

    useEffect(() => {
        setIsLoadingStats(true);
        getUserFlashcards().then(data => {
            setFlashcardStats(data || []);
            setIsLoadingStats(false);
        }).catch(err => {
            console.error(err);
            setIsLoadingStats(false);
        });
    }, [mode]);

    // Dashboard calculations
    const masteryThreshold = 2400; // ease > 2400 & interval > 3
    const masteredCount = flashcardStats.filter(s => s.interval >= 3 && s.easeFactor >= masteryThreshold).length;
    const readinessScore = Math.min(100, Math.round((masteredCount / QUESTION_BANK.length) * 100));
    const needsReviewCount = flashcardStats.filter(s => new Date(s.nextReviewDate) <= new Date()).length;
    const strugglingCount = flashcardStats.filter(s => s.incorrectCount > s.correctCount && s.incorrectCount > 0).length;

    const start = useCallback(() => {
        let pool = QUESTION_BANK;

        if (filter === "65") {
            pool = pool.filter((q) => q.isSpecial65);
        } else if (filter === "review") {
            const upForReviewIds = flashcardStats
                .filter(s => new Date(s.nextReviewDate) <= new Date())
                .map(s => s.questionId);
            pool = pool.filter(q => upForReviewIds.includes(q.id));
            if (pool.length === 0) {
                // If nothing strictly up for review, give them ones they haven't seen or are struggling with
                const seenIds = flashcardStats.map(s => s.questionId);
                pool = pool.filter(q => !seenIds.includes(q.id) || flashcardStats.find(s => s.questionId === q.id)?.incorrectCount! > 0);
            }
        } else if (CATEGORIES.includes(filter)) {
            pool = pool.filter(q => q.category === filter);
        }

        if (pool.length === 0) {
            pool = QUESTION_BANK; // Fallback
        }

        setQuestions(shuffle(pool));
        setIndex(0);
        setRevealed(false);
        setMarks({});
        setMode("practice");
    }, [filter, flashcardStats]);

    const current = questions[index];
    const total = questions.length;
    const correctSession = Object.values(marks).filter((v) => v === "correct").length;
    const incorrectSession = Object.values(marks).filter((v) => v === "incorrect").length;
    const progress = Math.round(((index) / total) * 100);

    const mark = async (verdict: "correct" | "incorrect") => {
        // Optimistic local mark for UI
        setMarks((prev) => ({ ...prev, [current.id]: verdict }));

        const qScore = verdict === "correct" ? 4 : 1;
        try {
            // Update Neo DB state
            updateFlashcardStat(current.id, qScore);
        } catch (error) {
            console.error("Failed to update spaced repetition stat:", error);
        }

        if (index < total - 1) {
            setIndex((i) => i + 1);
            setRevealed(false);
        } else {
            // End of deck
            setTimeout(() => setMode("setup"), 1000);
        }
    };

    const skip = () => {
        if (index < total - 1) {
            setIndex((i) => i + 1);
            setRevealed(false);
        }
    };

    if (mode === "setup") {
        return (
            <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto h-full items-stretch">
                {/* ── Dashboard Sidebar ── */}
                <div className="lg:w-[340px] shrink-0 flex flex-col gap-5">
                    <div
                        className="rounded-2xl p-6 text-white relative overflow-hidden shadow-lg"
                        style={{ background: "linear-gradient(135deg, #002868 0%, #001f52 100%)" }}
                    >
                        <div className="absolute top-0 left-0 right-0 py-1.5 overflow-hidden">
                            <span className="text-white/10 text-[10px] tracking-[8px]">★ ★ ★ ★ ★ ★ ★ ★ ★</span>
                        </div>
                        <h2 className="text-2xl font-black mt-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                            Your Readiness
                        </h2>

                        <div className="mt-6 flex flex-col items-center justify-center">
                            <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-[6px] border-[#B22234] bg-white/5">
                                <div className="text-center">
                                    <div className="text-4xl font-black">{readinessScore}%</div>
                                    <div className="text-xs font-bold uppercase tracking-wider text-[#E8C97A]">Ready</div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-white/75 font-medium flex items-center gap-2">
                                    <Trophy className="w-4 h-4 text-[#E8C97A]" /> Mastered
                                </span>
                                <span className="font-bold">{masteredCount} / 128</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-white/75 font-medium flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-emerald-400" /> Up for Review
                                </span>
                                <span className="font-bold">{needsReviewCount}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-white/75 font-medium flex items-center gap-2">
                                    <XCircle className="w-4 h-4 text-rose-400" /> Consistently Missed
                                </span>
                                <span className="font-bold">{strugglingCount}</span>
                            </div>
                        </div>

                    </div>

                    <div className="bg-white rounded-2xl p-6 border-2 border-[#002868]/10 shadow-sm flex flex-col gap-4">
                        <div className="flex items-center gap-2 text-[#002868] font-black text-lg" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                            <BarChart3 className="w-5 h-5" /> Overall Progress
                        </div>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed">
                            Practice with Spaced Repetition to focus only on what you need to learn. Flashcards you routinely miss will appear more often.
                        </p>
                        {isLoadingStats && <div className="text-sm font-semibold text-amber-600 animate-pulse mt-2">Syncing your progress...</div>}
                    </div>
                </div>

                {/* ── Main Deck Selection ── */}
                <div className="flex-1 flex flex-col">
                    <div className="mb-6">
                        <h2 className="text-3xl font-black text-[#002868]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                            Select a Deck
                        </h2>
                        <p className="text-gray-500 font-medium text-lg">Categories & targeted practice modes</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-min mb-8">
                        {/* Spaced Repetition Smart Deck */}
                        <button
                            onClick={() => setFilter("review")}
                            className={`col-span-1 md:col-span-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl border-2 transition-all ${filter === "review"
                                ? "border-[#16a34a] bg-[#F0FFF4] shadow-lg"
                                : "border-[#16a34a]/30 bg-white hover:border-[#16a34a]/60 hover:shadow-md"
                                }`}
                        >
                            <div className="flex gap-4 items-center">
                                <div className="w-14 h-14 rounded-xl bg-[#16a34a] flex items-center justify-center text-white shadow-md shrink-0">
                                    <BrainCircuit className="w-8 h-8" />
                                </div>
                                <div className="text-left">
                                    <div className="text-lg font-black text-gray-900 border-b-2 border-transparent">
                                        Smart Review <span className="text-xs bg-[#16a34a]/20 text-[#166534] px-2 py-0.5 rounded ml-2 uppercase tracking-wide">Recommended</span>
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1 font-medium">Uses spaced repetition to ask what you need right now.</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="text-right hidden sm:block">
                                    <div className="text-sm font-bold text-gray-900">{needsReviewCount > 0 ? needsReviewCount : '∞'} Cards</div>
                                    <div className="text-xs text-gray-500 tracking-wider uppercase font-semibold">Ready</div>
                                </div>
                                {filter === "review" && (
                                    <div className="w-6 h-6 rounded-full bg-[#16a34a] text-white flex items-center justify-center"><CheckCircle className="w-4 h-4" /></div>
                                )}
                            </div>
                        </button>

                        {/* All Questions */}
                        <button
                            onClick={() => setFilter("all")}
                            className={`flex flex-col gap-2 p-5 rounded-2xl border-2 text-left transition-all ${filter === "all"
                                ? "border-[#002868] bg-[#E8F0FF] shadow-lg"
                                : "border-gray-200 bg-white hover:border-[#002868]/40 hover:shadow-md"
                                }`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="text-3xl font-black" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#002868" }}>
                                    {QUESTION_BANK.length}
                                </div>
                                {filter === "all" && <CheckCircle className="w-5 h-5 text-[#002868]" />}
                            </div>
                            <div>
                                <div className="text-base font-bold text-gray-900">All Questions</div>
                                <div className="text-sm text-gray-500 font-medium">The full 2025 bank</div>
                            </div>
                        </button>

                        {/* 65/20 Special */}
                        <button
                            onClick={() => setFilter("65")}
                            className={`flex flex-col gap-2 p-5 rounded-2xl border-2 text-left transition-all ${filter === "65"
                                ? "border-amber-500 bg-amber-50 shadow-lg"
                                : "border-gray-200 bg-white hover:border-amber-300 hover:shadow-md"
                                }`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="text-3xl font-black text-amber-600 flex items-center gap-1.5" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                    {QUESTION_BANK.filter((q) => q.isSpecial65).length}
                                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                                </div>
                                {filter === "65" && <CheckCircle className="w-5 h-5 text-amber-600" />}
                            </div>
                            <div>
                                <div className="text-base font-bold text-gray-900">65/20 Exemption</div>
                                <div className="text-sm text-gray-500 font-medium">For qualifying older applicants</div>
                            </div>
                        </button>

                        {/* Category Decks */}
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`col-span-1 md:col-span-2 flex justify-between items-center p-4 rounded-xl border-2 text-left transition-all ${filter === cat
                                    ? "border-[#B22234] bg-[#FFF5F5] shadow-md"
                                    : "border-gray-200 bg-white hover:border-[#B22234]/40 hover:shadow-sm"
                                    }`}
                            >
                                <div>
                                    <span className="text-[11px] font-black uppercase tracking-wider text-[#B22234]/60">Category Theme</span>
                                    <div className="text-base font-bold text-gray-900 mt-0.5">{cat}</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="bg-gray-100 text-gray-600 font-bold px-3 py-1 rounded text-sm">
                                        {QUESTION_BANK.filter(q => q.category === cat).length}
                                    </div>
                                    {filter === cat && <CheckCircle className="w-5 h-5 text-[#B22234]" />}
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="sticky bottom-0 pb-6 pt-4 bg-gradient-to-t from-[#F8F5EE] to-transparent">
                        <Button
                            onClick={start}
                            className="w-full h-16 rounded-2xl text-lg font-black transition-all shadow-xl active:scale-95 border-b-4 border-black/20 hover:brightness-110"
                            style={{ background: "#B22234", color: "white" }}
                        >
                            <Shuffle className="w-6 h-6 mr-2" /> Start Practice Deck
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (!current) {
        return (
            <div className="flex items-center justify-center p-20 text-center flex-col gap-4">
                <BrainCircuit className="w-16 h-16 text-[#16a34a] opacity-50" />
                <h3 className="text-2xl font-black text-[#002868]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>No cards left to review right now!</h3>
                <p className="text-gray-500 font-medium">You're completely caught up. Go rest, or study all questions.</p>
                <Button onClick={() => setMode("setup")} variant="outline" className="mt-4 font-bold rounded-xl h-12">Return to Dashboard</Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 max-w-2xl mx-auto py-4">
            {/* Top Bar */}
            <div className="flex items-center justify-between text-gray-600 bg-white shadow-sm p-4 rounded-xl border-b-4 border-[#002868]/10">
                <button
                    onClick={() => setMode("setup")}
                    className="flex items-center gap-2 text-sm font-black text-[#002868] hover:text-[#B22234] transition uppercase tracking-wide"
                >
                    <ChevronLeft className="w-4 h-4" /> Exit
                </button>
                <div className="text-base font-black tracking-widest text-[#002868]">
                    {index + 1} <span className="opacity-30 mx-1">/</span> <span className="opacity-50">{total}</span>
                </div>
                <button
                    onClick={() => { setIndex(0); setRevealed(false); setMarks({}); }}
                    className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition font-bold"
                >
                    <RotateCcw className="w-4 h-4" /> Restart
                </button>
            </div>

            {/* Session Progress Tracker */}
            <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm font-bold px-2">
                    <span className="text-[#16a34a]">Got It: {correctSession}</span>
                    <span className="text-[#B22234]">Missed: {incorrectSession}</span>
                </div>
                <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                    <div
                        className="h-full rounded-full transition-all duration-700 relative"
                        style={{
                            width: `${Math.max(5, progress)}%`,
                            background: "linear-gradient(90deg, #002868 0%, #4a78c8 40%, #B22234 100%)",
                        }}
                    >
                        <div className="absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-white/30" />
                    </div>
                </div>
            </div>

            {/* Flashcard Frame */}
            <div className="relative group perspective-1000">
                <div
                    className={`rounded-3xl border-4 bg-white min-h-[320px] flex flex-col justify-between p-8 shadow-2xl transition-all duration-500 ${revealed ? 'border-[#002868]' : 'border-[#002868]/40 hover:border-[#002868]/60 cursor-pointer'}`}
                    onClick={() => !revealed && setRevealed(true)}
                >
                    {/* Inner Content Container */}
                    <div className="flex flex-col h-full">
                        {/* Tags */}
                        <div className="flex flex-wrap items-center gap-2 mb-6">
                            <span className="text-xs font-black font-mono text-white px-2.5 py-1 rounded-md bg-[#002868] shadow-sm tracking-widest">
                                #{current.id.replace("q-", "").padStart(3, '0')}
                            </span>
                            {current.isSpecial65 && (
                                <span className="flex items-center gap-1 text-[11px] uppercase tracking-wider font-bold text-[#b45309] bg-amber-100/80 px-2.5 py-1 rounded-md shadow-sm">
                                    <Star className="w-3 h-3 fill-[#b45309]" /> 65/20 Rule
                                </span>
                            )}
                            {current.category && (
                                <span className="text-[11px] font-bold uppercase tracking-wider text-[#002868] px-2.5 py-1 rounded-md bg-[#002868]/10 shadow-sm">
                                    {current.category}
                                </span>
                            )}
                        </div>

                        {/* Prompt */}
                        <p className="text-2xl sm:text-3xl text-gray-900 font-black leading-tight tracking-tight mt-auto mb-auto py-8">
                            {current.prompt}
                        </p>

                        {!revealed && (
                            <div className="mt-8 pt-6 border-t border-gray-100 text-center text-gray-400 font-semibold tracking-wide flex items-center justify-center gap-2 animate-pulse">
                                <Eye className="w-5 h-5" /> TAP ANYWHERE TO REVEAL
                            </div>
                        )}

                        {revealed && (
                            <div className="mt-8 pt-6 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {current.isDynamicOfficial ? (
                                    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl">
                                        <p className="text-md text-amber-900 font-bold flex items-center gap-2">
                                            <span className="text-xl">⚡</span> Changes with elections
                                        </p>
                                        <p className="text-sm text-amber-800 mt-1 font-medium leading-relaxed">
                                            Visit <a href="https://uscis.gov/citizenship/testupdates" target="_blank" className="underline font-bold hover:text-amber-600 transition">uscis.gov/citizenship/testupdates</a> for the current answer.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Accepted Answers</p>
                                        <div className="flex flex-wrap gap-2.5">
                                            {current.acceptedAnswers.map((ans) => (
                                                <span
                                                    key={ans}
                                                    className="text-base sm:text-lg font-bold border-2 px-4 py-2.5 rounded-xl shadow-sm bg-[#F0FFF4] border-[#16a34a]/30 text-[#166534]"
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
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3 mt-4 h-24">
                {revealed && (
                    <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <Button
                            onClick={() => mark("incorrect")}
                            variant="outline"
                            className="h-16 rounded-2xl border-b-4 border-[#B22234]/40 font-black text-lg transition-all active:scale-95 shadow-md bg-white text-[#B22234] hover:bg-[#FFF0F0] hover:border-[#B22234] hover:text-[#B22234]"
                        >
                            <XCircle className="w-6 h-6 mr-2" /> Missed
                        </Button>
                        <Button
                            onClick={() => mark("correct")}
                            className="h-16 rounded-2xl font-black text-lg shadow-[0_8px_0_0_#166534] transition-all active:translate-y-2 active:shadow-[0_0px_0_0_#166534] bg-[#16a34a] hover:bg-[#15803d] text-white"
                        >
                            <CheckCircle className="w-6 h-6 mr-2" /> Got It
                        </Button>
                    </div>
                )}
            </div>

            <button
                onClick={skip}
                className="text-xs font-bold text-gray-400 hover:text-gray-700 transition text-center mt-2 tracking-widest uppercase opacity-75 focus:outline-none"
                disabled={index >= total - 1}
            >
                Skip Card
            </button>
        </div>
    );
}
