/** Shared data used by both the Daily Practice page and getDailyCompletion. */

export const SPEAKING = [
  { id: "sp-1", title: "Pain Assessment" },
  { id: "sp-2", title: "Medication Explanation" },
  { id: "sp-3", title: "Pre-operative Preparation" },
  { id: "sp-4", title: "Breaking Difficult News" },
  { id: "sp-5", title: "Discharge Instructions" },
] as const;

export const LISTENING = [
  { id: "sc1",  title: "Post-Cardiac Surgery Handover" },
  { id: "sc2",  title: "Chest Pain Assessment" },
  { id: "sc3",  title: "Fluid Balance Ward Round" },
  { id: "sc4",  title: "Medication Phone Consultation" },
  { id: "sc5",  title: "Hip Replacement Discharge" },
  { id: "sc6",  title: "Deteriorating Paediatric Patient" },
  { id: "sc7",  title: "Pre-operative Consent Briefing" },
  { id: "sc8",  title: "Mental Health Anxiety Assessment" },
  { id: "sc9",  title: "Sepsis Protocol Briefing" },
  { id: "sc10", title: "Diabetes Self-Management" },
] as const;

export const WRITING = [
  { id: "wr-1", title: "Cardiac Referral" },
  { id: "wr-2", title: "Diabetic Foot Referral" },
  { id: "wr-3", title: "Post-Surgical Physiotherapy" },
  { id: "wr-4", title: "Mental Health Transfer" },
  { id: "wr-5", title: "Respiratory Discharge" },
] as const;

/** Task IDs for the 4 required daily modules. */
export const REQUIRED_TASK_IDS = ["vocab", "listening", "speaking", "writing"] as const;
export type RequiredTaskId = typeof REQUIRED_TASK_IDS[number];

export function getDayOfYear(): number {
  const d = new Date();
  return Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000);
}

export function pick<T>(arr: readonly T[]): T {
  return arr[getDayOfYear() % arr.length];
}
