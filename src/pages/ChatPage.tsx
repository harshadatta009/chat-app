import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebase";
import { collection, query, where, addDoc, getDocs, onSnapshot, doc, getDoc, orderBy } from "firebase/firestore";
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

    useEffect(() => {
        const fetchChatData = async () => {
            try {
                const user = auth.currentUser;
                if (!user) return;

                if (userId) {
                    // **Handle private user chats**
                    const recipientDoc = await getDoc(doc(db, "users", userId));
                    if (recipientDoc.exists()) {
                        setChatName(recipientDoc.data()?.username || "Unnamed User");
                    }

                    const q = query(collection(db, "conversations"), where("participants", "array-contains", user.uid));
                    const querySnapshot = await getDocs(q);

                    const existingConversation = querySnapshot.docs.find(doc =>
                        doc.data().participants.includes(userId)
                    );

                    if (existingConversation) {
                        setConversationId(existingConversation.id);
                    } else {
                        const docRef = await addDoc(collection(db, "conversations"), {
                            participants: [user.uid, userId],
                        });
                        setConversationId(docRef.id);
                    }
                } else if (groupId) {
                    // **Handle group chats (Fix: Use 'groups' collection instead of 'conversations')**
                    const groupDoc = await getDoc(doc(db, "groups", groupId));
                    if (groupDoc.exists()) {
                        setChatName(groupDoc.data()?.groupName || "Unnamed Group");
                        setConversationId(groupId); // **Use groupId as conversationId**
                    }
                }
            } catch (error) {
                console.error("Error fetching chat data:", error);
            }
        };

        fetchChatData();
    }, [userId, groupId]);

    useEffect(() => {
        if (conversationId) {
            const chatPath = userId
                ? `conversations/${conversationId}/messages`
                : `groups/${conversationId}/messages`; // **Fix: Correct path for groups**

            const unsubscribe = onSnapshot(
                query(collection(db, chatPath), orderBy("createdAt", "asc")),
                snapshot => {
                    const fetchedMessages = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setMessages(fetchedMessages);
                }
            );

            return () => unsubscribe();
        }
    }, [conversationId]);

    const handleSendMessage = async (text: string) => {
        if (!text.trim() || !conversationId) return;

        try {
            const user = auth.currentUser;
            if (user) {
                const chatPath = userId
                    ? `conversations/${conversationId}/messages`
                    : `groups/${conversationId}/messages`; // **Fix: Correct path for groups**

                await addDoc(collection(db, chatPath), {
                    senderId: user.uid,
                    text,
                    createdAt: new Date(),
                });
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="d-flex flex-column vh-100">
            <div className="p-2 bg-primary text-white text-center">{chatName}</div>
            <ChatBox messages={messages} currentUserId={auth.currentUser?.uid || ""} />
            <MessageInput onSend={handleSendMessage} />
        </div>
    );
};

export default ChatPage;
