import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getSessionView } from "@/lib/civics/session-store";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ sessionId: string }> } // Await params in Next.js 15 app router
) {
    const { userId, has } = await auth();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Protect route for Plus plan only
    const isPlus = has ? has({ plan: "plus" } as any) : false;
    if (!isPlus) {
        return NextResponse.json({ error: "Premium feature. Please upgrade to the Plus plan." }, { status: 403 });
    }

    try {
        const { sessionId } = await params;
        const session = getSessionView(sessionId, userId);
        return NextResponse.json({ session }, { status: 200 });
    } catch (error) {
        console.error("GET Session Error:", error);
        return NextResponse.json(
            { error: "Session not found" },
            { status: 404 }
        );
    }
}
