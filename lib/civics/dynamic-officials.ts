import type { DynamicOfficialRecord, DynamicOfficialsSnapshot, DynamicType } from "@/lib/domain/civics";

type DynamicOfficialStore = {
  records: Map<DynamicType, DynamicOfficialRecord>;
  updateLog: Array<{ actorId: string; type: DynamicType; value: string; updatedAt: string }>;
};

const defaultPresident = process.env.CIVICTEST_DYNAMIC_PRESIDENT ?? "Donald Trump";

const store: DynamicOfficialStore = {
  records: new Map<DynamicType, DynamicOfficialRecord>([
    [
      "PRESIDENT",
      {
        type: "PRESIDENT",
        value: defaultPresident,
        lastUpdated: "2025-01-20",
        updatedBy: "system-seed",
      },
    ],
  ]),
  updateLog: [],
};

export function listDynamicOfficials(): DynamicOfficialRecord[] {
  return Array.from(store.records.values());
}

export function getDynamicOfficial(type: DynamicType): DynamicOfficialRecord | null {
  return store.records.get(type) ?? null;
}

export function updateDynamicOfficial(params: {
  actorId: string;
  type: DynamicType;
  value: string;
}): DynamicOfficialRecord {
  const next: DynamicOfficialRecord = {
    type: params.type,
    value: params.value.trim(),
    lastUpdated: new Date().toISOString(),
    updatedBy: params.actorId,
  };

  store.records.set(params.type, next);
  store.updateLog.push({
    actorId: params.actorId,
    type: params.type,
    value: params.value.trim(),
    updatedAt: next.lastUpdated,
  });

  return next;
}

export function getDynamicUpdateLog(): Array<{ actorId: string; type: DynamicType; value: string; updatedAt: string }> {
  return [...store.updateLog];
}

export function getDynamicSnapshot(): DynamicOfficialsSnapshot {
  const records = listDynamicOfficials();
  const newest = records
    .map((item) => item.lastUpdated)
    .sort()
    .at(-1) ?? new Date().toISOString();

  return {
    records,
    snapshotVersion: newest,
  };
}
