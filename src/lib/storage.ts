import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { storage } from './firebase';

export const STORAGE_FOLDERS = {
  USERS: 'users',
  REPORTS: 'reports',
  DOCUMENTS: 'documents',
  LOGOS: 'logos',
  BUSINESS: 'business',
  PAYMENTS: 'payments',
  AGREEMENTS: 'agreements',
  BRANDING: 'branding',
  RESEARCH: 'research'
} as const;

export type StorageFolder = typeof STORAGE_FOLDERS[keyof typeof STORAGE_FOLDERS];

/**
 * Uploads a file to Firebase Storage inside a specified folder.
 * @param folder One of the standard storage folders
 * @param pathName The name of the file or sub-path (e.g. user-id/avatar.png)
 * @param file The file Blob or File object to upload
 */
export async function uploadToStorage(folder: StorageFolder, pathName: string, file: Blob | File): Promise<string> {
  // 6. File upload safety: Validate file size (max 5MB)
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File exceeds maximum allowed size of 5MB');
  }

  // 6. File upload safety: Validate file type (prevent execution as code)
  const allowedMimeTypes = [
    'image/jpeg', 'image/png', 'image/webp', 'image/svg+xml',
    'application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain', 'text/csv'
  ];
  if (!allowedMimeTypes.includes(file.type)) {
    throw new Error('Invalid file type. File must be an image, PDF, or text document.');
  }

  // Enforce folder names are virtual directories
  const cleanPath = `${folder}/${pathName.replace(/^\//, '')}`;
  const storageRef = ref(storage, cleanPath);
  
  try {
    console.log(`Uploading file of type ${file.type} to Firebase Storage: ${cleanPath}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (error) {
    console.error(`Firebase Storage upload failed on path: ${cleanPath}`, error);
    throw error;
  }
}

/**
 * Deletes a file from Firebase Storage.
 * @param fileUrl The full download URL of the file to delete
 */
export async function deleteFromStorage(fileUrl: string): Promise<void> {
  try {
    const storageRef = ref(storage, fileUrl);
    await deleteObject(storageRef);
  } catch (error) {
    console.error(`Firebase Storage deletion failed for URL: ${fileUrl}`, error);
    throw error;
  }
}

/**
 * Lists all file references in a virtual storage folder.
 * @param folder One of the standard storage folders
 */
export async function listFolderFiles(folder: StorageFolder) {
  const folderRef = ref(storage, folder);
  try {
    const res = await listAll(folderRef);
    return res.items;
  } catch (error) {
    console.error(`Firebase Storage list failed for folder: ${folder}`, error);
    throw error;
  }
}
