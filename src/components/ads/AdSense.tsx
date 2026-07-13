import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export function AdSense({ slot }: { slot: string }) {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const docRef = doc(db, 'settings', 'ads');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSettings(docSnap.data());
      }
    };
    fetchSettings();
  }, []);

  if (!settings || !settings.enabled || !settings.publisherId) return null;

  return (
    <ins className="adsbygoogle"
         style={{ display: 'block' }}
         data-ad-client={settings.publisherId}
         data-ad-slot={slot}
         data-ad-format="auto"
         data-full-width-responsive="true"></ins>
  );
}
