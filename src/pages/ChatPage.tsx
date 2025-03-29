import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../firebase/firebase";
import { collection, query, where, addDoc, getDocs, onSnapshot, doc, getDoc, orderBy } from "firebase/firestore";
import ChatBox from "../components/Chat/ChatBox";
import MessageInput from "../components/Chat/MessageInput";

const ChatPage: React.FC = () => {
    const { userId} = useParams<{ userId: string}>();
    const [conversationId, setConversationId] = useState<string | null>( null);
    const [messages, setMessages] = useState<any[]>([]);
    const [recipientName, setRecipientName] = useState<string>("");

    useEffect(() => {
        const fetchOrCreateConversation = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const recipientDoc = await getDoc(doc(db, "users", userId!));
                    if (recipientDoc.exists()) {
                        setRecipientName(recipientDoc.data()?.username || "Unnamed User");
                    }

                    const q = query(
                        collection(db, "conversations"),
                        where("participants", "array-contains", user.uid)
                    );
                    const querySnapshot = await getDocs(q);

                    const existingConversation = querySnapshot.docs.find((doc) =>
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
                }
            } catch (error) {
                console.error("Error fetching/creating conversation:", error);
            }
        };

        fetchOrCreateConversation();
    }, [userId]);

    useEffect(() => {
        if (conversationId) {
            const unsubscribe = onSnapshot(
                query(collection(db, `conversations/${conversationId}/messages`), orderBy("createdAt", "asc")),
                (snapshot) => {
                    const fetchedMessages = snapshot.docs.map((doc) => ({
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
                await addDoc(collection(db, `conversations/${conversationId}/messages`), {
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
        <div>
            <h3 className="text-center">{recipientName}</h3>
            <ChatBox messages={messages} currentUserId={auth.currentUser?.uid || ""}  />
            <MessageInput onSend={handleSendMessage} />
        </div>
    );
};

export default ChatPage;
