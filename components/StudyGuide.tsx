"use client";

import { useState, useMemo } from "react";
import { Search, ChevronDown, ChevronUp, Star } from "lucide-react";
import { QUESTION_BANK, getQuestionsByCategory } from "@/lib/civics/question-bank";
import type { CivicsQuestion } from "@/lib/domain/civics";

const ALL_CATEGORIES = ["All", ...Object.keys(getQuestionsByCategory())];

export default function StudyGuide() {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [show65Only, setShow65Only] = useState(false);
    const [expanded, setExpanded] = useState<string | null>(null);

    const filtered = useMemo(() => {
        return QUESTION_BANK.filter((q) => {
            const matchCat = selectedCategory === "All" || q.category === selectedCategory;
            const match65 = !show65Only || q.isSpecial65;
            const matchSearch = !search || q.prompt.toLowerCase().includes(search.toLowerCase());
            return matchCat && match65 && matchSearch;
        });
    }, [search, selectedCategory, show65Only]);

    const byCategory = useMemo(() => {
        const map: Record<string, CivicsQuestion[]> = {};
        for (const q of filtered) {
            const cat = q.category ?? "General";
            if (!map[cat]) map[cat] = [];
            map[cat].push(q);
        }
        return map;
    }, [filtered]);

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div
                className="rounded-2xl p-6 text-white relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #002868 0%, #001f52 100%)" }}
            >
                <div className="absolute top-0 left-0 right-0 py-1.5 overflow-hidden">
                    <span className="text-white/15 text-[10px] tracking-[8px]">★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★</span>
                </div>
                <div className="mt-3">
                    <h2
                        className="text-2xl font-black text-white mb-1"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                        Study Guide
                    </h2>
                    <p className="text-base text-white/75">
                        {filtered.length} of {QUESTION_BANK.length} questions — explore all official answers
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-4 bg-white rounded-2xl p-5 border border-[#002868]/10 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search questions..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl pl-12 pr-5 py-3.5 text-base text-gray-800 placeholder:text-gray-400 outline-none focus:border-[#002868] transition shadow-inner"
                    />
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                    {ALL_CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`text-sm font-semibold px-4 py-2 rounded-full border-2 transition-all ${selectedCategory === cat
                                    ? "bg-[#002868] border-[#002868] text-white shadow-md"
                                    : "border-gray-200 text-gray-600 hover:border-[#002868]/50 hover:text-[#002868] bg-white"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                    <button
                        onClick={() => setShow65Only(!show65Only)}
                        className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full border-2 transition-all ${show65Only
                                ? "bg-amber-500 border-amber-500 text-white shadow-md"
                                : "border-amber-300 text-amber-700 hover:border-amber-400 bg-amber-50"
                            }`}
                    >
                        <Star className="w-4 h-4" /> 65/20 Special
                    </button>
                </div>
            </div>

            {/* Questions by Category */}
            <div className="flex flex-col gap-8">
                {Object.entries(byCategory).map(([cat, questions]) => (
                    <div key={cat}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-0.5 w-4 bg-[#B22234]" />
                            <h2
                                className="text-sm font-black text-[#002868] uppercase tracking-widest"
                            >
                                {cat}
                            </h2>
                            <div className="flex-1 h-px bg-[#002868]/15" />
                            <span className="text-sm text-gray-400 font-medium">{questions.length}</span>
                        </div>
                        <div className="flex flex-col gap-2.5">
                            {questions.map((q) => (
                                <QuestionCard
                                    key={q.id}
                                    question={q}
                                    isExpanded={expanded === q.id}
                                    onToggle={() => setExpanded(expanded === q.id ? null : q.id)}
                                />
                            ))}
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && (
                    <div className="text-center py-16 text-gray-400 text-lg font-medium bg-white rounded-2xl border border-gray-200">
                        🔍 No questions match your search.
                    </div>
                )}
            </div>
        </div>
    );
}

function QuestionCard({ question, isExpanded, onToggle }: {
    question: CivicsQuestion;
    isExpanded: boolean;
    onToggle: () => void;
}) {
    return (
        <div
            onClick={onToggle}
            className={`rounded-xl border-2 bg-white cursor-pointer transition-all ${isExpanded
                    ? "border-[#002868] shadow-lg shadow-blue-900/10"
                    : "border-gray-200 hover:border-[#002868]/40 hover:shadow-md"
                }`}
        >
            <div className="flex items-start gap-4 p-5">
                <div className="flex flex-col items-center gap-1 flex-shrink-0 min-w-[36px]">
                    <span
                        className="text-sm font-black font-mono rounded px-1.5 py-0.5 text-white"
                        style={{ background: "#002868" }}
                    >
                        {question.id.replace("q-", "")}
                    </span>
                    {question.isSpecial65 && (
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    )}
                </div>
                <p className="flex-1 text-base text-gray-800 leading-relaxed font-semibold">{question.prompt}</p>
                <div className="flex-shrink-0 mt-0.5 text-[#002868]/60">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
            </div>
            {isExpanded && (
                <div className="px-5 pb-5 border-t-2 border-[#002868]/10 pt-4">
                    {question.isDynamicOfficial ? (
                        <div className="text-base text-amber-700 italic font-medium bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                            ⚡ This answer depends on the current official. Visit{" "}
                            <span className="underline">uscis.gov/citizenship/testupdates</span> for the latest.
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <p className="text-sm font-bold text-[#002868] uppercase tracking-wider">Accepted Answers:</p>
                            <div className="flex flex-wrap gap-2">
                                {question.acceptedAnswers.map((ans) => (
                                    <span
                                        key={ans}
                                        className="text-sm font-medium border-2 px-3 py-1.5 rounded-lg"
                                        style={{ background: "#E8F0FF", borderColor: "#002868", color: "#001f52" }}
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
