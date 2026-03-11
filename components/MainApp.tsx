"use client";

import { useState } from "react";
import { Mic, BookOpen, GraduationCap, LogOut, Lock } from "lucide-react";
import { UserButton, useClerk, useAuth } from "@clerk/nextjs";
import InterviewSimulator from "@/components/InterviewSimulator";
import StudyGuide from "@/components/StudyGuide";
import PracticeMode from "@/components/PracticeMode";
import UpgradeMessage from "@/components/UpgradeMessage";

type Tab = "interview" | "study" | "practice";

const NAV_ITEMS: { id: Tab; label: string; icon: React.ReactNode; description: string; emoji: string; premium?: boolean }[] = [
    { id: "interview", label: "Interview", icon: <Mic className="w-5 h-5" />, description: "Voice-based USCIS simulation", emoji: "🎙️", premium: true },
    { id: "practice", label: "Practice", icon: <GraduationCap className="w-5 h-5" />, description: "Flashcard self-assessment", emoji: "📚", premium: true },
    { id: "study", label: "Study Guide", icon: <BookOpen className="w-5 h-5" />, description: "Browse all 128 Q&A", emoji: "📖" },
];

export default function MainApp() {
    // Determine the initial tab based on permission. Default to study guide if they're free, interview if plus.
    const { has } = useAuth();
    // TS-ignore just in case the type definitions of `has` don't include `plan` yet, though Clerk might have updated it.
    const isPlus = has ? has({ plan: 'plus' } as any) : false;

    const [activeTab, setActiveTab] = useState<Tab>(isPlus ? "interview" : "study");
    const { signOut } = useClerk();

    const activeItem = NAV_ITEMS.find((n) => n.id === activeTab)!;

    return (
        <div className="flex h-screen overflow-hidden" style={{ background: "#F8F5EE" }}>
            {/* ── Left Sidebar ── */}
            <aside className="w-64 flex flex-col shrink-0 border-r border-[#002868]/20" style={{ background: "#002868" }}>
                {/* Brand */}
                <div className="px-6 py-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        {/* Mini flag */}
                        <div className="w-9 h-6 rounded overflow-hidden flex flex-col shadow-md">
                            <div className="flex-1 bg-[#B22234]" />
                            <div className="flex-1 bg-white" />
                            <div className="flex-1 bg-[#B22234]" />
                        </div>
                        <div>
                            <span
                                className="text-xl font-black text-white tracking-tight"
                                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                            >
                                CivicTest
                            </span>
                            <span className="text-sm font-bold text-[#E8C97A] ml-1.5">2025</span>
                        </div>
                    </div>
                    <p className="text-xs text-white/50 mt-2 font-medium uppercase tracking-wider">USCIS Prep Platform</p>
                </div>

                {/* Stars decoration */}
                <div className="px-6 py-2 overflow-hidden">
                    <span className="text-white/15 text-[10px] tracking-[6px]">★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★</span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-4 flex flex-col gap-1.5">
                    <p className="text-[11px] uppercase tracking-widest text-white/40 font-bold px-3 mb-3">Modules</p>
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`relative group flex items-center gap-3.5 w-full px-4 py-3.5 rounded-xl text-base transition-all text-left font-medium ${activeTab === item.id
                                ? "bg-[#B22234] text-white shadow-lg shadow-red-900/30"
                                : "text-white/70 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            <span className={`transition-colors ${activeTab === item.id ? "text-white" : "text-white/50 group-hover:text-white/80"}`}>
                                {item.icon}
                            </span>
                            <div className="flex flex-col">
                                <span>{item.label}</span>
                                <span className={`text-xs font-normal ${activeTab === item.id ? "text-white/75" : "text-white/35"}`}>
                                    {item.description}
                                </span>
                            </div>

                            {/* Premium Lock icon for Free users */}
                            {item.premium && !isPlus && (
                                <Lock className={`absolute right-4 w-4 h-4 ${activeTab === item.id ? "text-white" : "text-white/20"} transition-colors`} />
                            )}
                        </button>
                    ))}
                </nav>

                {/* Bottom red stripe decoration */}
                <div className="h-1 flex">
                    {Array.from({ length: 13 }).map((_, i) => (
                        <div key={i} className="flex-1" style={{ background: i % 2 === 0 ? "#B22234" : "rgba(255,255,255,0.4)" }} />
                    ))}
                </div>

                {/* User section */}
                <div className="px-5 py-4 border-t border-white/10 bg-[#001f52]">
                    <div className="flex items-center justify-between">
                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: "w-9 h-9 border-2 border-[#E8C97A]",
                                },
                            }}
                        />
                        <button
                            onClick={() => signOut()}
                            className="text-sm text-white/50 hover:text-white transition flex items-center gap-1.5 font-medium"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign out
                        </button>
                    </div>
                </div>
            </aside>

            {/* ── Main Content Panel ── */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Page header */}
                <div className="border-b-2 border-[#002868]/15 bg-white px-8 py-5 shrink-0 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#002868" }}>
                        <span className="text-xl">{activeItem.emoji}</span>
                    </div>
                    <div>
                        <h1
                            className="text-2xl font-black text-[#002868]"
                            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                        >
                            {activeItem.label}
                        </h1>
                        <p className="text-base text-gray-500 font-medium mt-0.5">{activeItem.description}</p>
                    </div>
                    {/* Header accent stripe */}
                    <div className="ml-auto hidden sm:flex gap-1">
                        {["#B22234", "white", "#002868", "white", "#B22234"].map((c, i) => (
                            <div
                                key={i}
                                className="w-4 h-8 rounded"
                                style={{ background: c, border: c === "white" ? "1px solid #eee" : "none" }}
                            />
                        ))}
                    </div>
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto px-6 py-8" style={{ background: "#F8F5EE" }}>
                    <div className="mx-auto w-full h-full">
                        {/* Protected Sections */}
                        {activeItem.premium && !isPlus ? (
                            <UpgradeMessage featureTitle={activeItem.label} />
                        ) : (
                            <>
                                {activeTab === "interview" && <div className="max-w-3xl mx-auto"><InterviewSimulator /></div>}
                                {activeTab === "practice" && <PracticeMode />}
                            </>
                        )}

                        {/* Always available */}
                        {activeTab === "study" && <div className="max-w-4xl mx-auto"><StudyGuide /></div>}
                    </div>
                </div>
            </main>
        </div>
    );
}
