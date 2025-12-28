import { initializeApp, getApps, type FirebaseOptions } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  type Firestore,
  type DocumentData,
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
      "Missing VITE_FIREBASE_* environment variables. See README."
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
