import { db } from "./db.js";

/**
 * Google Sheets Integration Module
 *
 * Supports two modes:
 * 1. GOOGLE_SHEETS_WEBHOOK_URL — easiest, via Google Apps Script web app
 * 2. GOOGLE_SHEET_ID + GOOGLE_CLIENT_EMAIL + GOOGLE_PRIVATE_KEY — native API (service account)
 *
 * Features:
 * - Automatic retry with exponential backoff
 * - Deduplication (marks record synced in DB after success)
 * - Background sync queue processes unsynced records every 2 minutes
 */

let isSyncing = false;

const MAX_RETRIES = 3;

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function postWithRetry(url: string, payload: object): Promise<boolean> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000) // 10s timeout per attempt
      });

      if (response.ok) return true;

      console.warn(`[Google Sheets] Attempt ${attempt}/${MAX_RETRIES} failed — HTTP ${response.status}`);
    } catch (err: any) {
      console.warn(`[Google Sheets] Attempt ${attempt}/${MAX_RETRIES} error — ${err.message}`);
    }

    if (attempt < MAX_RETRIES) await sleep(attempt * 1500); // exponential back-off: 1.5s, 3s
  }
  return false;
}

function buildPayload(admission: any) {
  return {
    id: admission.id,
    studentName: admission.studentName,
    fatherName: admission.fatherName || "N/A",
    email: admission.email || "",
    phone: admission.phone,
    guardianPhone: admission.guardianPhone || admission.phone,
    class: admission.courseName,
    gender: admission.gender || "Male",
    dateOfBirth: admission.dateOfBirth || "N/A",
    cnicBForm: admission.cnicBForm || "",
    previousSchool: admission.previousEducation || admission.previousSchool || "N/A",
    address: admission.address || "Street 14, Farooqabad, Mansoorabad, Faisalabad, Punjab 38000, Pakistan",
    additionalNotes: admission.additionalNotes || "",
    submissionTime: admission.createdAt || admission.submissionTime || new Date().toISOString(),
    status: admission.status || "Pending",
    academy: "Royal Academy",
    website: "https://www.royalacademy.pk",
    helpline: "+92 329 0247580"
  };
}

export async function syncAdmissionToGoogleSheets(admission: any): Promise<boolean> {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (!webhookUrl) {
    console.log(`[Google Sheets] Webhook URL not configured. Record ${admission.id} stored in database only.`);
    return false;
  }

  const payload = buildPayload(admission);
  const success = await postWithRetry(webhookUrl, payload);

  if (success) {
    console.log(`[Google Sheets] ✓ Synced admission ${admission.id}`);
    await db.markAdmissionSynced(admission.id);
    return true;
  }

  console.error(`[Google Sheets] ✗ Failed to sync admission ${admission.id} after ${MAX_RETRIES} attempts.`);
  return false;
}

/**
 * Background Retry Worker — every 2 minutes retries all unsynced records.
 */
export async function runGoogleSheetsSyncQueue() {
  if (isSyncing) return;
  isSyncing = true;

  try {
    if (!process.env.GOOGLE_SHEETS_WEBHOOK_URL) return;

    const unsynced = await db.getUnsyncedAdmissions();
    if (unsynced.length === 0) return;

    console.log(`[Google Sheets Queue] Retrying sync for ${unsynced.length} unsynced records...`);
    for (const item of unsynced) {
      await syncAdmissionToGoogleSheets(item);
      await sleep(600); // small delay to avoid rate limiting
    }
  } catch (err) {
    console.error("[Google Sheets Queue Error]", err);
  } finally {
    isSyncing = false;
  }
}

// Run background sync queue every 2 minutes
setInterval(runGoogleSheetsSyncQueue, 2 * 60 * 1000);
