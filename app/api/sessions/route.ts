import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { startSession } from "@/lib/civics/session-store";

export async function POST(): Promise<NextResponse> {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = startSession(userId);
  return NextResponse.json({ session }, { status: 201 });
}
