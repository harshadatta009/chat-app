import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyBfy1rUMEityNzzmdj4-AC4Zf5Zzp_b6-8",
    authDomain: "react-chat-app-79213.firebaseapp.com",
    projectId: "react-chat-app-79213",
    storageBucket: "react-chat-app-79213.firebasestorage.app",
    messagingSenderId: "1076898769634",
    appId: "1:1076898769634:web:3ade10bc7eb6f9dc624cbb"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app); // Firebase Authentication
export const db = getFirestore(app); // Firestore Database
