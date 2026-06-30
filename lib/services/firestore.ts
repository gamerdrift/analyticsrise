import { db } from '../firebase/config';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query
} from 'firebase/firestore';

/**
 * Generic Firestore Service Layer
 * 
 * Provides type-safe wrappers for common Firebase Firestore database actions.
 * Decoupled from nested SDK type declarations to prevent compilation conflicts.
 */
export const FirestoreService = {
  /**
   * Fetch a single document by ID
   */
  async getDocument<T>(collectionName: string, docId: string): Promise<T | null> {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    return null;
  },

  /**
   * Set or fully overwrite/merge a document by ID
   */
  async setDocument<T extends object>(
    collectionName: string, 
    docId: string, 
    data: T
  ): Promise<void> {
    const docRef = doc(db, collectionName, docId);
    // Explicit type assertions are used to decouple dependencies
    await setDoc(docRef, data as Record<string, unknown>, { merge: true });
  },

  /**
   * Add a new document with an auto-generated ID
   */
  async addDocument<T extends object>(
    collectionName: string, 
    data: T
  ): Promise<string> {
    const colRef = collection(db, collectionName);
    const docRef = await addDoc(colRef, data as Record<string, unknown>);
    return docRef.id;
  },

  /**
   * Update specific fields of an existing document
   */
  async updateDocument<T extends object>(
    collectionName: string, 
    docId: string, 
    data: Partial<T> | Record<string, unknown>
  ): Promise<void> {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, data as Record<string, unknown>);
  },

  /**
   * Delete a document by ID
   */
  async deleteDocument(collectionName: string, docId: string): Promise<void> {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  },

  /**
   * Query a collection with constraints (where, orderBy, limit, etc.)
   */
  async queryDocuments<T>(
    collectionName: string, 
    constraints: unknown[]
  ): Promise<T[]> {
    const colRef = collection(db, collectionName);
    const q = query(colRef, ...(constraints as any[]));
    const querySnapshot = await getDocs(q);
    const results: T[] = [];
    querySnapshot.forEach((docSnap: any) => {
      results.push({ id: docSnap.id, ...docSnap.data() } as T);
    });
    return results;
  }
};
export default FirestoreService;
