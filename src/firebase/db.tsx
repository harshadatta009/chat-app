import { db, auth } from "./firebase";
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
    updateDoc,
    arrayUnion,
} from "firebase/firestore";

/**
 * Send a message in a 1-on-1 chat or group chat.
 * @param text - The message text.
 * @param userId - The sender's user ID.
 * @param channelId - The conversation/group ID.
 * @param isGroup - Boolean indicating if it's a group chat.
 */
export const sendMessage = async (
    text: string,
    userId: string,
    channelId: string,
    isGroup: boolean = false
) => {
    try {
        const userDoc = await getDoc(doc(db, "users", userId));
        const username = userDoc.exists()
            ? userDoc.data()?.username || "Unknown User"
            : "Unknown User";

        const messagesRef = collection(db, isGroup ? `groups/${channelId}/messages` : `conversations/${channelId}/messages`);

        return await addDoc(messagesRef, {
            text,
            userId,
            username,
            createdAt: Timestamp.now(),
        });
    } catch (error) {
        console.error("Error sending message:", error);
        throw error;
    }
};

/**
 * Listen to real-time message updates for a chat (1-on-1 or group).
 * @param channelId - The conversation/group ID.
 * @param isGroup - Boolean indicating if it's a group chat.
 * @param callback - Function to handle incoming messages.
 */
export const listenToMessages = (
    channelId: string,
    isGroup: boolean = false,
    callback: (messages: any[]) => void
) => {
    try {
        const messagesRef = collection(db, isGroup ? `groups/${channelId}/messages` : `conversations/${channelId}/messages`);

        const q = query(messagesRef, orderBy("createdAt", "asc"));

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

/**
 * Fetch username by user ID.
 * @param userId - The user ID.
 * @returns The username.
 */
export const getUsername = async (userId: string) => {
    try {
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

/**
 * Create or fetch a conversation between two users.
 * @param userId1 - First user ID.
 * @param userId2 - Second user ID.
 * @returns The conversation ID.
 */
export const fetchOrCreateConversation = async (userId1: string, userId2: string) => {
    try {
        const conversationsRef = collection(db, "conversations");

        const q = query(conversationsRef, where("participants", "array-contains", userId1));

        const snapshot = await getDocs(q);
        const existingConversation = snapshot.docs.find((doc) =>
            doc.data().participants.includes(userId2)
        );

        if (existingConversation) {
            return existingConversation.id;
        }

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

/**
 * Create a group chat with a name and selected users.
 * @param groupName - The name of the group.
 * @param selectedUserIds - Array of user IDs to be added.
 * @returns The created group ID.
 */
export const createGroup = async (groupName: string, selectedUserIds: string[]) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not authenticated");

        const participants = [...new Set([user.uid, ...selectedUserIds])];

        const docRef = await addDoc(collection(db, "groups"), {
            groupName,
            participants,
            createdBy: user.uid,
            createdAt: Timestamp.now(),
        });

        return docRef.id;
    } catch (error) {
        console.error("Error creating group:", error);
        throw error;
    }
};

/**
 * Fetch groups that the current user is part of.
 * @returns An array of groups.
 */
export const fetchUserGroups = async () => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not authenticated");

        const groupsRef = collection(db, "groups");
        const q = query(groupsRef, where("participants", "array-contains", user.uid));
        const snapshot = await getDocs(q);

        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error("Error fetching user groups:", error);
        throw error;
    }
};

/**
 * Add a user to an existing group.
 * @param groupId - The group ID.
 * @param userId - The user ID to be added.
 */
export const addUserToGroup = async (groupId: string, userId: string) => {
    try {
        const groupRef = doc(db, "groups", groupId);

        await updateDoc(groupRef, {
            participants: arrayUnion(userId),
        });

        console.log(`User ${userId} added to group ${groupId}`);
    } catch (error) {
        console.error("Error adding user to group:", error);
        throw error;
    }
};
