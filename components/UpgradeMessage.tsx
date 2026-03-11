"use client";

import { PricingTable } from "@clerk/nextjs";
import { Lock } from "lucide-react";

export default function UpgradeMessage({ featureTitle }: { featureTitle: string }) {
    return (
        <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto py-12 px-6">
            <div className="mb-8 text-center">
                <div className="w-16 h-16 bg-[#002868]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-[#002868]" />
                </div>
                <h2 className="text-3xl font-black text-[#002868] mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    Unlock {featureTitle}
                </h2>
                <p className="text-gray-500 text-lg max-w-lg mx-auto leading-relaxed mb-4">
                    You need the Plus plan to access this premium feature. Upgrade today to unlock the full USCIS interview experience and advanced practice tools.
                </p>
                <div className="bg-[#B22234]/10 border border-[#B22234]/20 rounded-xl p-4 max-w-lg mx-auto text-left shadow-sm">
                    <p className="text-sm text-gray-700 leading-relaxed">
                        <span className="font-semibold text-[#B22234]">Why is there a fee?</span>{" "}
                        While our study guide remains completely free, features like the voice interview simulator require advanced AI models to process speech and generate realistic officer voices.
                        Your small subscription fee directly covers these AI usage costs and helps maintain our servers.
                    </p>
                </div>
            </div>

            <div className="w-full bg-white rounded-3xl p-6 shadow-xl border border-[#002868]/10">
                <PricingTable />
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-center text-gray-400 mt-6 max-w-md">
                Secure payment processed by Stripe via Clerk Billing. You can cancel your subscription at any time from your account settings.
            </p>
        </div>
    );
}
