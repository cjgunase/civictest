import type { DynamicOfficialRecord, DynamicOfficialsSnapshot, DynamicType } from "@/lib/domain/civics";

type DynamicOfficialStore = {
  records: Map<DynamicType, DynamicOfficialRecord>;
  updateLog: Array<{ actorId: string; type: DynamicType; value: string; updatedAt: string }>;
};

const store: DynamicOfficialStore = {
  records: new Map<DynamicType, DynamicOfficialRecord>([
    ["PRESIDENT", { type: "PRESIDENT", value: process.env.CIVICTEST_DYNAMIC_PRESIDENT ?? "Donald Trump", lastUpdated: "2025-01-20", updatedBy: "system-seed" }],
    ["VICE_PRESIDENT", { type: "VICE_PRESIDENT", value: process.env.CIVICTEST_DYNAMIC_VP ?? "JD Vance", lastUpdated: "2025-01-20", updatedBy: "system-seed" }],
    ["SPEAKER", { type: "SPEAKER", value: process.env.CIVICTEST_DYNAMIC_SPEAKER ?? "Mike Johnson", lastUpdated: "2025-01-03", updatedBy: "system-seed" }],
    ["CHIEF_JUSTICE", { type: "CHIEF_JUSTICE", value: process.env.CIVICTEST_DYNAMIC_CHIEF_JUSTICE ?? "John Roberts", lastUpdated: "2005-09-29", updatedBy: "system-seed" }],
  ]),
  updateLog: [],
};

export function listDynamicOfficials(): DynamicOfficialRecord[] {
  return Array.from(store.records.values());
}

export function getDynamicOfficial(type: DynamicType): DynamicOfficialRecord | null {
  return store.records.get(type) ?? null;
}

export function updateDynamicOfficial(params: { actorId: string; type: DynamicType; value: string }): DynamicOfficialRecord {
  const next: DynamicOfficialRecord = {
    type: params.type,
    value: params.value.trim(),
    lastUpdated: new Date().toISOString(),
    updatedBy: params.actorId,
  };
  store.records.set(params.type, next);
  store.updateLog.push({ actorId: params.actorId, type: params.type, value: params.value.trim(), updatedAt: next.lastUpdated });
  return next;
}

export function getDynamicUpdateLog() {
  return [...store.updateLog];
}

export function getDynamicSnapshot(): DynamicOfficialsSnapshot {
  const records = listDynamicOfficials();
  const newest = records.map((i) => i.lastUpdated).sort().at(-1) ?? new Date().toISOString();
  return { records, snapshotVersion: newest };
}
