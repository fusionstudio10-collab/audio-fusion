import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCXMn5urCuXvW1E4qabBNiS3hmTJL6-tVM",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "audio-fusion.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "audio-fusion",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "audio-fusion.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "787231927513",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:787231927513:web:1ecb3851071100bcf8e2c8",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-H6K4T0DFSY"
};

// Initialize Firebase client side safely
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const db = getFirestore(app);
export const storage = getStorage(app);

// Fetch config from Firestore database
export async function fetchRemoteConfig() {
  try {
    const docRef = doc(db, "settings", "active");
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error("Firebase fetch error, falling back to local:", error);
    return null;
  }
}

// Save config to Firestore database
export async function saveRemoteConfig(configData) {
  try {
    const docRef = doc(db, "settings", "active");
    await setDoc(docRef, configData);
    return true;
  } catch (error) {
    console.error("Firebase save error:", error);
    throw error;
  }
}

// Upload dynamic image to Firebase Storage
export async function uploadImageFile(file, filePath) {
  try {
    const storageRef = ref(storage, filePath);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Storage upload helper failed:", error);
    throw error;
  }
}
