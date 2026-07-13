import { db } from './firebase';
import { doc, getDoc, updateDoc, setDoc, onSnapshot } from 'firebase/firestore';

export interface PricingConfig {
  enableAutomatedAdjustment: boolean;
}

export const toggleAutomatedPricing = async (enabled: boolean) => {
  const ref = doc(db, 'system_config', 'pricing');
  await setDoc(ref, { enableAutomatedAdjustment: enabled }, { merge: true });
};

export const subscribeToPricingConfig = (callback: (config: PricingConfig) => void) => {
  const ref = doc(db, 'system_config', 'pricing');
  return onSnapshot(ref, (snap) => {
    if (snap.exists()) {
      callback(snap.data() as PricingConfig);
    } else {
      callback({ enableAutomatedAdjustment: true });
    }
  });
};

