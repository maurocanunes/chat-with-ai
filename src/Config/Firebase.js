import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDLFN4VHPjQjP6Jg7TgOKi4qDVokq9rBig",
    authDomain: "chat-with-ai-8074b.firebaseapp.com",
    projectId: "chat-with-ai-8074b",
    storageBucket: "chat-with-ai-8074b.appspot.com",
    messagingSenderId: "730272488758",
    appId: "1:730272488758:web:199b4bca273c2e36ebe797",
    measurementId: "G-SM7CEPWSYF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
auth.useDeviceLanguage();
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);
const apiKeyCollectionRef = collection(db, 'chat')


export {
  auth,
  googleProvider,
  db,
  apiKeyCollectionRef
}