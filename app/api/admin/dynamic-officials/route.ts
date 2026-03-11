import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import {
  getDynamicUpdateLog,
  listDynamicOfficials,
  updateDynamicOfficial,
} from "@/lib/civics/dynamic-officials";
import type { DynamicType } from "@/lib/domain/civics";

function isAdmin(userId: string): boolean {
  return Boolean(process.env.ADMIN_CLERK_USER_ID && userId === process.env.ADMIN_CLERK_USER_ID);
}

export async function GET(): Promise<NextResponse> {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(
    {
      records: listDynamicOfficials(),
      updates: getDynamicUpdateLog(),
    },
    { status: 200 }
  );
}

export async function POST(request: Request): Promise<NextResponse> {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isAdmin(userId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as { type?: DynamicType; value?: string };

  if (!body.type || !body.value || !body.value.trim()) {
    return NextResponse.json({ error: "type and value are required" }, { status: 400 });
  }

  const record = updateDynamicOfficial({
    actorId: userId,
    type: body.type,
    value: body.value,
  });

  return NextResponse.json({ record }, { status: 200 });
}
