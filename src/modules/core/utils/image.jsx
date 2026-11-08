import { createImageStorage } from './image-storage';
import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL, uploadBytes, deleteObject } from "firebase/storage";


const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.storageBucket ? initializeApp(firebaseConfig) : null;
const storage = app ? getStorage(app) : null;

export const { uploadFile, renameFile } = createImageStorage(storage, { ref, uploadBytes, getDownloadURL, deleteObject });
