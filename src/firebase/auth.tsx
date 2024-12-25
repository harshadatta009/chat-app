import { setDoc, doc } from "firebase/firestore";
import { db } from './firebase';
import { auth } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, setPersistence, browserSessionPersistence, updateProfile } from "firebase/auth";

// Register a new user
// Register a new user
export const registerUser = async (email: string, password: string, username: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Set the displayName in Firebase Authentication
    await updateProfile(user, {
        displayName: username,
    });

    // Save the uid and username in Firestore
    await setDoc(doc(db, "users", user.uid), {
        uid: user.uid, // Add the uid here
        username,
        email,
    });
};

// Log in an existing user
export const loginUser = async (email: string, password: string) => {
    try {
        // Set session persistence
        await setPersistence(auth, browserSessionPersistence);
        // Perform login
        return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error("Login error:", error);
        throw error; // Re-throw the error so the calling function can handle it
    }
};

// Log out the user
export const logoutUser = async () => {
    return await signOut(auth);
};
