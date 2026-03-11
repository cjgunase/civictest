import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { startSession } from "@/lib/civics/session-store";

export async function POST(): Promise<NextResponse> {
  const { userId, has } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Protect route for Plus plan only
  const isPlus = has ? has({ plan: "plus" } as any) : false;
  if (!isPlus) {
    return NextResponse.json({ error: "Premium feature. Please upgrade to the Plus plan." }, { status: 403 });
  }

  const session = startSession(userId);
  return NextResponse.json({ session }, { status: 201 });
}
