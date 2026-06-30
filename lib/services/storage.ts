import { storage } from '../firebase/config';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

/**
 * Storage Service
 * 
 * Interfaces with Firebase Storage to upload assets (such as user profile avatars or resume PDFs)
 * and manage file resources.
 */
export const StorageService = {
  /**
   * Upload a raw file (Blob, File, or array bytes) to a specific destination path
   */
  async uploadFile(path: string, file: Blob | Uint8Array | ArrayBuffer): Promise<string> {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
  },

  /**
   * Fetch the public download URL for a file located at a storage path
   */
  async getFileDownloadUrl(path: string): Promise<string> {
    const storageRef = ref(storage, path);
    return getDownloadURL(storageRef);
  },

  /**
   * Remove a file from Firebase Storage by its storage path
   */
  async deleteFile(path: string): Promise<void> {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  }
};
export default StorageService;
