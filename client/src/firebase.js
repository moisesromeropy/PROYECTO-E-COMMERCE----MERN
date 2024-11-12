// I. Importación de funciones necesarias desde el SDK de Firebase
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// II. Configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// III. Inicialización de Firebase
export const firebaseApp = initializeApp(firebaseConfig);

// IV. Inicialización del servicio de autenticación de Firebase
export const auth = getAuth(firebaseApp);

// V. Configuración del proveedor de autenticación de Google
export const googleProvider = new GoogleAuthProvider();

// VI. Función para iniciar sesión con Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // Aquí puedes manejar la respuesta de la autenticación, como guardar el usuario en el contexto o en el estado
    return result.user;
  } catch (error) {
    // Manejo de errores de autenticación
    console.error("Error al iniciar sesión con Google:", error);
    throw error;
  }
};
