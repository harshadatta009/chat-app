import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebase/firebase"; 
import { logoutUser } from "../firebase/auth"; 

const useAuth = () => {
    const [user, setUser] = useState<User | null>(null); // Current user state
    const [loading, setLoading] = useState(true); // Loading state to track initialization

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                // If a user is logged in, update the user state
                setUser(currentUser);
                setLoading(false);
            } else {
                // If the user is logged out or session expires, clear the user state
                setUser(null);
                setLoading(false);
                // Optionally, log out explicitly to clean up any lingering session data
                await logoutUser();
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    return { user, loading };
};

export default useAuth;
