import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { answerSession } from "@/lib/civics/session-store";

type Params = {
  params: Promise<{ sessionId: string }>;
};

export async function POST(request: Request, { params }: Params): Promise<NextResponse> {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sessionId } = await params;
  const body = (await request.json()) as { transcript?: string };

  if (typeof body.transcript !== "string") {
    return NextResponse.json({ error: "transcript must be a string" }, { status: 400 });
  }

  try {
    const session = answerSession({
      sessionId,
      userId,
      transcript: body.transcript,
    });

    return NextResponse.json({ session }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = message === "Forbidden" ? 403 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
