"use client";

import { useEffect, useState } from "react";
import { getAndRecordVisitorStats } from "@/app/actions/visitor";
import { Globe2, Activity } from "lucide-react";

type VisitorStat = {
    totalVisits: number;
    recentLocations: { city: string; country: string }[];
};

export default function LiveVisitorStats() {
    const [stats, setStats] = useState<VisitorStat | null>(null);

    useEffect(() => {
        async function loadStats() {
            // Check if this is a new session
            const isNew = !sessionStorage.getItem("visited");
            if (isNew) {
                sessionStorage.setItem("visited", "true");
            }
            const data = await getAndRecordVisitorStats(isNew);
            setStats(data);
        }
        loadStats();

        // Polling every 15s to make it look alive!
        const interval = setInterval(async () => {
            const data = await getAndRecordVisitorStats(false);
            setStats(data);
        }, 15000);
        return () => clearInterval(interval);
    }, []);

    if (!stats) return null;

    return (
        <div className="w-full max-w-5xl mx-auto px-6 mt-8 md:mt-12 z-20 relative">
            <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-2xl p-6 md:p-8 text-white transition-all hover:bg-white/15">
                {/* Animated Glow */}
                <div className="absolute -top-32 -left-32 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20 pointer-events-none animate-pulse" />
                <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-[#B22234] rounded-full blur-[100px] opacity-20 pointer-events-none animate-pulse" />

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12 w-full justify-between">
                    {/* Total Counters */}
                    <div className="flex flex-col gap-2 items-center md:items-start shrink-0 text-center md:text-left">
                        <div className="flex items-center gap-2 text-sm font-semibold tracking-widest text-[#E8C97A] uppercase justify-center md:justify-start">
                            <Activity className="w-4 h-4 animate-pulse" />
                            Live Network
                        </div>
                        <div className="flex flex-col items-center md:items-start">
                            <span className="text-5xl border-b-2 border-white/10 md:border-none pb-2 md:pb-0 md:text-6xl font-black tabular-nums tracking-tighter drop-shadow-md text-white md:-ml-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                {stats.totalVisits.toLocaleString()}
                            </span>
                            <span className="text-sm md:text-base text-white/80 font-medium mt-1">total prep sessions</span>
                        </div>
                    </div>

                    {/* Scrolling / Live Feed of Locations */}
                    <div className="flex-1 w-full">
                        <div className="flex items-center gap-2 mb-3 text-xs md:text-sm font-semibold text-white/50 uppercase tracking-widest justify-center md:justify-start">
                            <Globe2 className="w-4 h-4" /> Real-time active locations
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                            {stats.recentLocations.map((loc, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-3 bg-black/20 hover:bg-black/30 transition-colors border border-white/10 rounded-xl px-4 py-3 shadow-inner"
                                    style={{ animation: `fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s both` }}
                                >
                                    <span className="relative flex h-2.5 w-2.5 shrink-0">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                                    </span>
                                    <div className="text-sm font-medium truncate text-white/90">
                                        {loc.city}, {loc.country}
                                    </div>
                                </div>
                            ))}
                            {stats.recentLocations.length === 0 && (
                                <div className="text-sm text-white/50 italic py-2">Waiting for new visitors...</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(12px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}} />
        </div>
    );
}
