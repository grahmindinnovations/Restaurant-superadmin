import { initializeApp } from 'firebase/app'
import { getAuth, signInAnonymously } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

// Only attempt anonymous auth when explicitly enabled in .env.
// If Anonymous sign-in is not enabled in Firebase Console, calling it triggers a 400 in the browser console.
const enableAnonAuth = import.meta.env.VITE_FIREBASE_ENABLE_ANON_AUTH === 'true'
if (enableAnonAuth) {
  signInAnonymously(auth).catch(() => {
    // ignore: rules may still block, but app should remain usable
  })
}

export const db = getFirestore(app)

