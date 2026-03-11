"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Mic, BookOpen, GraduationCap, ArrowRight, Star } from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
    return (
        <main className="min-h-screen bg-white flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* ── Top Nav ── */}
            <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b-2 border-[#002868]">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Mini-flag stripes as logo mark */}
                        <div className="w-8 h-6 rounded overflow-hidden flex flex-col">
                            <div className="flex-1 bg-[#B22234]" />
                            <div className="flex-1 bg-white" />
                            <div className="flex-1 bg-[#B22234]" />
                        </div>
                        <div>
                            <span
                                className="text-xl font-bold text-[#002868] tracking-tight"
                                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                            >
                                CivicTest
                            </span>
                            <span className="text-sm font-semibold text-[#B22234] ml-1.5">2025</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <SignInButton mode="modal">
                            <button className="text-base font-medium text-[#002868] hover:text-[#B22234] transition px-5 py-2.5 rounded-lg hover:bg-blue-50">
                                Sign in
                            </button>
                        </SignInButton>
                        <SignUpButton mode="modal">
                            <button className="text-base font-bold bg-[#B22234] text-white px-6 py-2.5 rounded-lg hover:bg-[#8B1A27] transition shadow-md shadow-red-200">
                                Get Started →
                            </button>
                        </SignUpButton>
                    </div>
                </div>
            </header>

            {/* ── Hero ── */}
            <div className="relative w-full overflow-hidden" style={{ minHeight: "520px" }}>
                {/* Background monument image */}
                <Image
                    src="/monuments-hero.png"
                    alt="American monuments at sunset"
                    fill
                    className="object-cover object-center"
                    priority
                />
                {/* Overlay gradient */}
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(to bottom, rgba(60,59,110,0.72) 0%, rgba(60,59,110,0.60) 40%, rgba(10,10,30,0.85) 100%)",
                    }}
                />
                {/* Stars row */}
                <div className="absolute top-0 left-0 right-0 py-2 text-center overflow-hidden">
                    <span className="text-white/25 text-xs tracking-[10px]">★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★</span>
                </div>

                <div className="relative z-10 flex flex-col items-center justify-center px-6 py-20 text-center max-w-4xl mx-auto w-full">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2.5 mb-7 px-4 py-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm text-white text-sm font-semibold">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
                        128 Official USCIS 2025 Civics Questions
                    </div>

                    <h1
                        className="text-5xl md:text-6xl font-black text-white leading-tight mb-6 drop-shadow-lg"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                        Prepare for Your<br />
                        <span className="text-[#E8C97A]">U.S. Citizenship</span> Interview
                    </h1>

                    <p className="text-xl text-white/85 leading-relaxed max-w-2xl mb-10">
                        Simulate a real USCIS civics interview, practice with flashcards, and study all
                        128 official questions — completely free. Train like the interview is tomorrow.
                    </p>

                    <div className="flex items-center gap-4 flex-wrap justify-center">
                        <SignUpButton mode="modal">
                            <button className="flex items-center gap-2.5 text-lg font-bold bg-[#B22234] text-white px-8 py-4 rounded-xl hover:bg-[#8B1A27] transition shadow-xl shadow-red-900/40 active:scale-95">
                                Start Practicing Free
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </SignUpButton>
                        <SignInButton mode="modal">
                            <button className="text-base font-semibold text-white/80 hover:text-white transition px-5 py-4 rounded-xl border border-white/30 hover:bg-white/10 backdrop-blur-sm">
                                I have an account
                            </button>
                        </SignInButton>
                    </div>
                </div>

                {/* Bottom wave / stripe */}
                <div className="absolute bottom-0 left-0 right-0 h-3 flex">
                    {Array.from({ length: 13 }).map((_, i) => (
                        <div key={i} className="flex-1" style={{ background: i % 2 === 0 ? "#B22234" : "white" }} />
                    ))}
                </div>
            </div>

            {/* ── Feature Cards ── */}
            <div className="bg-[#F8F5EE] py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <p className="text-center text-sm font-bold text-[#B22234] uppercase tracking-[0.2em] mb-3">
                        ★ Three Ways to Prepare ★
                    </p>
                    <h2
                        className="text-center text-4xl font-black text-[#002868] mb-12"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                        Everything You Need to Pass
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[
                            {
                                icon: <Mic className="w-7 h-7 text-white" />,
                                color: "#B22234",
                                title: "Voice Interview Simulation",
                                desc: "Speak your answers aloud to a simulated USCIS officer, just like the real interview experience.",
                                badge: "Most Realistic",
                            },
                            {
                                icon: <GraduationCap className="w-7 h-7 text-white" />,
                                color: "#002868",
                                title: "Flashcard Practice",
                                desc: "Self-assess with card flips across all 128 questions. Mark what you know and what you need to review.",
                                badge: "Most Popular",
                            },
                            {
                                icon: <BookOpen className="w-7 h-7 text-white" />,
                                color: "#B22234",
                                title: "Complete Study Guide",
                                desc: "Browse every question with all accepted answers, organized by category. Study at your own pace.",
                                badge: "Start Here",
                            },
                        ].map((f) => (
                            <div
                                key={f.title}
                                className="rounded-2xl bg-white border border-gray-200 p-7 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col gap-4 relative overflow-hidden"
                            >
                                {/* Top stripe */}
                                <div className="absolute top-0 left-0 right-0 h-1.5" style={{ backgroundColor: f.color }} />
                                <div
                                    className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg"
                                    style={{ backgroundColor: f.color }}
                                >
                                    {f.icon}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span
                                            className="text-xs font-bold px-2.5 py-0.5 rounded-full text-white"
                                            style={{ backgroundColor: f.color, opacity: 0.85 }}
                                        >
                                            {f.badge}
                                        </span>
                                    </div>
                                    <div className="text-lg font-bold text-gray-900 mb-2 leading-snug">{f.title}</div>
                                    <div className="text-base text-gray-600 leading-relaxed">{f.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Stats banner ── */}
            <div className="bg-[#002868] py-12 px-6">
                <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
                    {[
                        { num: "128", label: "Official Questions" },
                        { num: "100%", label: "Free to Use" },
                        { num: "2025", label: "Updated Edition" },
                    ].map((s) => (
                        <div key={s.label}>
                            <div
                                className="text-5xl font-black text-[#E8C97A] mb-1"
                                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                            >
                                {s.num}
                            </div>
                            <div className="text-base font-medium text-white/80">{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── CTA band ── */}
            <div className="bg-[#B22234] py-16 px-6 text-center">
                <div className="max-w-2xl mx-auto">
                    <div className="text-white/80 text-sm font-bold uppercase tracking-widest mb-3">★ ★ ★</div>
                    <h3
                        className="text-3xl font-black text-white mb-4"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                        Your American Dream Starts Here
                    </h3>
                    <p className="text-lg text-white/80 mb-8">
                        Join thousands of applicants preparing for the naturalization interview.
                    </p>
                    <SignUpButton mode="modal">
                        <button className="inline-flex items-center gap-2.5 text-lg font-bold bg-white text-[#B22234] px-8 py-4 rounded-xl hover:bg-gray-100 transition shadow-xl active:scale-95">
                            <Star className="w-5 h-5 fill-[#B22234] text-[#B22234]" />
                            Begin Your Preparation
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </SignUpButton>
                </div>
            </div>

            {/* ── Footer ── */}
            <footer className="bg-[#1a1930] py-8 text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="flex gap-1">
                        {Array.from({ length: 13 }).map((_, i) => (
                            <div key={i} className="w-3 h-2" style={{ background: i % 2 === 0 ? "#B22234" : "white" }} />
                        ))}
                    </div>
                </div>
                <p className="text-sm text-white/50">
                    For educational purposes only. Not affiliated with or endorsed by USCIS or any government agency.
                </p>
                <p className="text-xs text-white/30 mt-1">
                    © {new Date().getFullYear()} CivicTest 2025
                </p>
            </footer>
        </main>
    );
}
