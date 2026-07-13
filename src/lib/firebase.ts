import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported as isAnalyticsSupported, logEvent } from 'firebase/analytics';
import { getMessaging, isSupported as isMessagingSupported } from 'firebase/messaging';
import { getRemoteConfig } from 'firebase/remote-config';
import { getFunctions } from 'firebase/functions';

import firebaseConfigJson from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: firebaseConfigJson.apiKey,
  authDomain: firebaseConfigJson.authDomain,
  projectId: firebaseConfigJson.projectId,
  storageBucket: firebaseConfigJson.storageBucket,
  messagingSenderId: firebaseConfigJson.messagingSenderId,
  appId: firebaseConfigJson.appId,
  measurementId: firebaseConfigJson.measurementId || ""
};

// Allow environment variables to override if they are explicitly set
if (import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_API_KEY.startsWith("AIza")) {
  firebaseConfig.apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
}
if (import.meta.env.VITE_FIREBASE_PROJECT_ID && import.meta.env.VITE_FIREBASE_PROJECT_ID !== "") {
  firebaseConfig.projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
}
if (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN && import.meta.env.VITE_FIREBASE_AUTH_DOMAIN !== "") {
  firebaseConfig.authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
}

// Validate config
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error("Firebase configuration is missing. Please ensure environment variables or firebase-applet-config.json are set.");
} else {
  console.log("Firebase initialized with project:", firebaseConfig.projectId);
}

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const dbId = (import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID && import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID !== "") 
  ? import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID 
  : (firebaseConfigJson.firestoreDatabaseId && firebaseConfigJson.firestoreDatabaseId !== "" ? firebaseConfigJson.firestoreDatabaseId : undefined);

export const db = getFirestore(app, dbId);
export const storage = getStorage(app);

// Graceful initialization of Analytics
export let analytics: any = null;
if (import.meta.env.VITE_ENABLE_FIREBASE_ANALYTICS === "true") {
  isAnalyticsSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(err => {
    console.warn("Analytics initialization failed, continuing without analytics:", err);
  });
}

// Graceful initialization of Cloud Messaging
export let messaging: any = null;
if (import.meta.env.VITE_ENABLE_FIREBASE_MESSAGING === "true") {
  isMessagingSupported().then((supported) => {
    if (supported) {
      messaging = getMessaging(app);
    }
  }).catch(err => {
    console.warn("Messaging initialization failed, continuing without messaging:", err);
  });
}

// Remote Config
export let remoteConfig: any = {
  settings: {
    minimumFetchIntervalMillis: 3600000
  }
};
if (import.meta.env.VITE_ENABLE_FIREBASE_REMOTE_CONFIG === "true") {
  try {
    remoteConfig = getRemoteConfig(app);
    remoteConfig.settings.minimumFetchIntervalMillis = 3600000; // 1 hour
  } catch (err) {
    console.warn("Remote Config initialization failed, continuing with stub:", err);
  }
}

// Cloud Functions
export const functions = getFunctions(app);

// Crashlytics Simulation (Web SDK doesn't natively support Crashlytics; exceptions are piped to Analytics & Console)
export const logErrorToCrashlytics = (error: Error, customMetadata?: Record<string, any>) => {
  console.error("🔥 [Crashlytics - Production Error Report]:", error);
  if (customMetadata) {
    console.error("Context:", customMetadata);
  }
  if (analytics) {
    try {
      logEvent(analytics, 'exception', {
        description: error.name + ': ' + error.message,
        fatal: true,
        ...customMetadata
      });
    } catch (e) {
      console.warn("Failed to log exception to Firebase Analytics:", e);
    }
  }
};
