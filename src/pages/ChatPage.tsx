import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebase";
import { collection, query, where, addDoc, getDocs, onSnapshot, doc, updateDoc, getDoc, orderBy } from "firebase/firestore";
import ChatBox from "../components/Chat/ChatBox";
import MessageInput from "../components/Chat/MessageInput";

interface ChatPageProps {
    userId?: string;
    groupId?: string;
}

const ChatPage: React.FC<ChatPageProps> = ({ userId, groupId }) => {
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [chatName, setChatName] = useState<string>("");
    const [isTyping, setIsTyping] = useState(false); //  Track typing status
    const currentUser = auth.currentUser;

    useEffect(() => {
        const fetchChatData = async () => {
            if (!currentUser) return;

            if (userId) {
                const recipientDoc = await getDoc(doc(db, "users", userId));
                if (recipientDoc.exists()) {
                    setChatName(recipientDoc.data()?.username || "Unnamed User");
                }

                const q = query(collection(db, "conversations"), where("participants", "array-contains", currentUser.uid));
                const querySnapshot = await getDocs(q);

                const existingConversation = querySnapshot.docs.find(doc => doc.data().participants.includes(userId));

                if (existingConversation) {
                    setConversationId(existingConversation.id);
                } else {
                    const docRef = await addDoc(collection(db, "conversations"), {
                        participants: [currentUser.uid, userId],
                    });
                    setConversationId(docRef.id);
                }
            } else if (groupId) {
                const groupDoc = await getDoc(doc(db, "groups", groupId));
                if (groupDoc.exists()) {
                    setChatName(groupDoc.data()?.groupName || "Unnamed Group");
                    setConversationId(groupId);
                }
            }
        };

        fetchChatData();
    }, [userId, groupId, currentUser]);

    useEffect(() => {
        if (!conversationId) return;

        const chatPath = userId ? `conversations/${conversationId}/messages` : `groups/${conversationId}/messages`;

        const unsubscribeMessages = onSnapshot(
            query(collection(db, chatPath), orderBy("createdAt", "asc")),
            snapshot => {
                setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            }
        );

        //  Listen for typing status from the other user
        if (userId) {
            const otherUserDocRef = doc(db, "users", userId);
            const unsubscribeTyping = onSnapshot(otherUserDocRef, snapshot => {
                if (snapshot.exists()) {
                    setIsTyping(snapshot.data()?.typing || false);
                }
            });

            return () => {
                unsubscribeMessages();
                unsubscribeTyping();
            };
        }

        return () => unsubscribeMessages();
    }, [conversationId, userId]);

    const handleSendMessage = async (text: string) => {
        if (!text.trim() || !conversationId || !currentUser) return;

        try {
            const chatPath = userId ? `conversations/${conversationId}/messages` : `groups/${conversationId}/messages`;

            await addDoc(collection(db, chatPath), {
                senderId: currentUser.uid,
                text,
                createdAt: new Date(),
            });

            // Stop typing when message is sent
            await updateDoc(doc(db, "users", currentUser.uid), { typing: false });
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="d-flex flex-column vh-100">
            <div className="p-2 bg-primary text-white text-center">{chatName}</div>
            <ChatBox messages={messages} currentUserId={currentUser?.uid || ""} />
            {isTyping && <p className="text-muted text-center">User is typing...</p>}
            <MessageInput onSend={handleSendMessage} userId={userId} />
        </div>
    );
};

export default ChatPage;
