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

function requireStorage() {
    if (!storage) {
        throw new Error('La subida de imágenes no está disponible: falta configurar el almacenamiento.');
    }
    return storage;
}

export async function uploadFile(file, to, name){
    const storageRef = ref(requireStorage(), `${to}/${name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
}

export async function renameFile(oldPath, newPath) {
    const storage = requireStorage();
    const oldRef = ref(storage, oldPath);
    const newRef = ref(storage, newPath);

    // Descargar el archivo existente
    const url = await getDownloadURL(oldRef);
    const response = await fetch(url);
    const blob = await response.blob();

    // Subir el archivo con el nuevo nombre
    await uploadBytes(newRef, blob);

    // Eliminar el archivo antiguo
    await deleteObject(oldRef);

    // Obtener la nueva URL de descarga
    const newUrl = await getDownloadURL(newRef);

    return newUrl;
}