// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// As credenciais do Firebase são carregadas a partir de variáveis de ambiente
// para garantir a segurança e não expor chaves sensíveis no código-fonte.
//
// Para desenvolvimento local, crie um arquivo `.env` na raiz do projeto e
// adicione as variáveis correspondentes (ex: VITE_API_KEY="...").
//
// Para deploy no GitHub Pages, configure as "Repository secrets" com os mesmos
// nomes de variáveis (ex: VITE_API_KEY).
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const db = getFirestore(app);
const auth = getAuth(app);

// Export the services to be used in other parts of the app
export { db, auth };
