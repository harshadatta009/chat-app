import { db } from "./firebase";
import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    Timestamp,
    doc,
    getDoc,
    where,
    getDocs,
} from "firebase/firestore";

// Add a new message to Firestore
export const sendMessage = async (
    text: string,
    userId: string,
    channelId: string
) => {
    try {
        // Get the user's username from Firestore
        const userDoc = await getDoc(doc(db, "users", userId));
        const username = userDoc.exists()
            ? userDoc.data()?.username || "Unknown User"
            : "Unknown User";

        // Add the new message to the "messages" collection
        const messagesRef = collection(db, "messages");
        return await addDoc(messagesRef, {
            text,
            userId,
            channelId,
            username,
            createdAt: Timestamp.now(),
        });
    } catch (error) {
        console.error("Error sending message:", error);
        throw error; // Ensure the caller knows of any issues
    }
};

// Listen to real-time updates for messages
export const listenToMessages = (
    channelId: string,
    callback: (messages: any[]) => void
) => {
    try {
        // Query Firestore for messages in the specified channel
        const messagesRef = collection(db, "messages");
        const q = query(
            messagesRef,
            where("channelId", "==", channelId),
            orderBy("createdAt", "asc")
        );

        // Listen for real-time updates
        return onSnapshot(q, (snapshot) => {
            const messages = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            callback(messages);
        });
    } catch (error) {
        console.error("Error listening to messages:", error);
        throw error;
    }
};

// Fetch username by user ID
export const getUsername = async (userId: string) => {
    try {
        // Get the user's document from Firestore
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
            return userDoc.data()?.username || "Unknown User";
        }
        return "Unknown User";
    } catch (error) {
        console.error(`Error fetching username for userId: ${userId}`, error);
        return "Unknown User";
    }
};

// Create or fetch a conversation between two users
export const fetchOrCreateConversation = async (
    userId1: string,
    userId2: string
) => {
    try {
        const conversationsRef = collection(db, "conversations");

        // Check if a conversation already exists
        const q = query(
            conversationsRef,
            where("participants", "array-contains", userId1)
        );

        const snapshot = await getDocs(q);
        const existingConversation = snapshot.docs.find((doc) =>
            doc.data().participants.includes(userId2)
        );

        if (existingConversation) {
            return existingConversation.id;
        }

        // Create a new conversation
        const newConversation = await addDoc(conversationsRef, {
            participants: [userId1, userId2],
            createdAt: Timestamp.now(),
        });

        return newConversation.id;
    } catch (error) {
        console.error("Error fetching/creating conversation:", error);
        throw error;
    }
};
