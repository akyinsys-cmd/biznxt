import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export async function logActivity(userId: string, action: string, details: any = {}) {
  try {
    if (!userId) return;
    await addDoc(collection(db, 'analytics_events'), {
      userId,
      name: action,
      metadata: details,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}
