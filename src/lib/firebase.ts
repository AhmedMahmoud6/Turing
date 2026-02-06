import { initializeApp, getApps, type FirebaseOptions } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  type Firestore,
  type DocumentData,
  getDocs,
  query,
  orderBy,
  where,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

let db: Firestore | null = null;

export function initFirebaseFromEnv() {
  if (getApps().length) {
    if (!db) db = getFirestore();
    return;
  }
  const apiKey =
    (import.meta.env.VITE_FIREBASE_API_KEY as string | undefined) ?? undefined;
  const authDomain =
    (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined) ??
    undefined;
  const projectId =
    (import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined) ??
    undefined;
  const storageBucket =
    (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined) ??
    undefined;
  const messagingSenderId =
    (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined) ??
    undefined;
  const appId =
    (import.meta.env.VITE_FIREBASE_APP_ID as string | undefined) ?? undefined;

  if (!apiKey || !projectId) {
    throw new Error(
      "Missing VITE_FIREBASE_* environment variables. See README.",
    );
  }

  const firebaseConfig: FirebaseOptions = {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
  } as FirebaseOptions;

  initializeApp(firebaseConfig);
  db = getFirestore();
}

export async function saveRegistration(workshopId: string, data: DocumentData) {
  initFirebaseFromEnv();

  if (!db) {
    throw new Error("Firestore not initialized");
  }

  const docRef = await addDoc(collection(db, "workshop_registrations"), {
    workshopId,
    ...data,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function saveCompetitionRegistration(data: DocumentData) {
  initFirebaseFromEnv();

  if (!db) {
    throw new Error("Firestore not initialized");
  }

  const docRef = await addDoc(collection(db, "innovatex_registrations"), {
    ...data,
    accepted: false,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function getCompetitionQuestions() {
  initFirebaseFromEnv();

  if (!db) {
    throw new Error("Firestore not initialized");
  }

  // Expect documents in collection `innovatex_questions` with fields:
  // { order: number, question: string, choices: string[] }
  const q = query(
    collection(db, "innovatex_questions"),
    orderBy("order", "asc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as DocumentData) }));
}

export async function setRegistrationResult(
  registrationId: string,
  accepted: boolean,
  answers?: DocumentData,
) {
  initFirebaseFromEnv();

  if (!db) {
    throw new Error("Firestore not initialized");
  }

  const ref = doc(db, "innovatex_registrations", registrationId);
  await updateDoc(ref, {
    accepted,
    answers: answers ?? null,
    resultAt: serverTimestamp(),
  });
}

export async function saveQuizSubmission(
  registrationId: string,
  answers: DocumentData,
  secondsLeft?: string | number,
  meta?: DocumentData,
) {
  initFirebaseFromEnv();

  if (!db) {
    throw new Error("Firestore not initialized");
  }

  // read registration snapshot to include user info
  const regRef = doc(db, "innovatex_registrations", registrationId);
  const regSnap = await getDoc(regRef as any);
  const regData = regSnap.exists() ? (regSnap.data() as DocumentData) : null;

  const payload = {
    registrationId,
    registration: regData,
    answers: answers ?? {},
    timeLeft: secondsLeft ?? null,
    meta: meta ?? {},
    submittedAt: serverTimestamp(),
  } as DocumentData;

  const docRef = await addDoc(
    collection(db, "innovatex_quiz_submissions"),
    payload,
  );

  // mark registration as having submitted quiz (don't set accepted)
  try {
    await updateDoc(regRef, {
      quizSubmitted: true,
      quizSubmissionRef: docRef.id,
      quizSubmittedAt: serverTimestamp(),
      timeLeft: secondsLeft ?? null,
      meta: meta ?? {},
    });
  } catch (e) {
    // ignore update errors
    console.warn("Failed to mark registration as submitted", e);
  }

  return docRef.id;
}

export async function getRegistrationById(registrationId: string) {
  initFirebaseFromEnv();
  if (!db) throw new Error("Firestore not initialized");

  const ref = doc(db, "innovatex_registrations", registrationId);
  const snap = await getDoc(ref as any);
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as DocumentData) };
}

export async function markQuizStarted(registrationId: string) {
  initFirebaseFromEnv();
  if (!db) throw new Error("Firestore not initialized");

  const ref = doc(db, "innovatex_registrations", registrationId);
  const snap = await getDoc(ref as any);
  if (!snap.exists()) throw new Error("Registration not found");

  const data = snap.data() as DocumentData;
  if (data.quizStartedAt) return data.quizStartedAt;

  await updateDoc(ref, { quizStartedAt: serverTimestamp() });

  const updated = await getDoc(ref as any);
  return updated.exists()
    ? (updated.data() as DocumentData).quizStartedAt
    : null;
}

export async function hasQuizSubmissionForEmail(
  email: string,
  excludeRegistrationId?: string,
) {
  initFirebaseFromEnv();
  if (!db) throw new Error("Firestore not initialized");

  const col = collection(db, "innovatex_registrations");
  const q = query(
    col,
    where("email", "==", email),
    where("quizSubmitted", "==", true),
  );
  const snap = await getDocs(q);
  if (snap.empty) return false;
  if (!excludeRegistrationId) return true;
  for (const d of snap.docs) {
    if (d.id !== excludeRegistrationId) return true;
  }
  return false;
}

export async function hasRegistrationWithEmail(email: string) {
  initFirebaseFromEnv();
  if (!db) throw new Error("Firestore not initialized");

  const col = collection(db, "innovatex_registrations");
  const q = query(col, where("email", "==", email));
  const snap = await getDocs(q);
  return !snap.empty;
}

export async function savePaymentRecord(data: DocumentData) {
  initFirebaseFromEnv();

  if (!db) {
    throw new Error("Firestore not initialized");
  }

  const docRef = await addDoc(collection(db, "payments"), {
    ...data,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}
