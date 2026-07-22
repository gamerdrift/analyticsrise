// app/python-lab/services/firestore.ts
// Simple Firestore helper for APAL autosave.
// Assumes Firebase has been initialized elsewhere (e.g., in firebase.ts).

import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { firebaseConfig } from '@/app/firebase/config';

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

/** Save notebook state for a user and mission */
export async function saveNotebook(uid: string, missionId: string, state: any) {
  const notebookRef = doc(db, 'users', uid, 'pythonLab', missionId);
  await setDoc(notebookRef, state, { merge: true });
}

/** Load notebook state if exists */
export async function loadNotebook(uid: string, missionId: string) {
  const notebookRef = doc(db, 'users', uid, 'pythonLab', missionId);
  const snap = await getDoc(notebookRef);
  if (snap.exists()) {
    return snap.data();
  }
  return null;
}
