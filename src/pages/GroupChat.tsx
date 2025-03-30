import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { listenToMessages, sendMessage } from "../firebase/db";
import { auth } from "../firebase/firebase";
import ChatBox from "../components/Chat/ChatBox";
import MessageInput from "../components/Chat/MessageInput";

const GroupChat: React.FC = () => {
    const { groupId } = useParams<{ groupId: string }>();
    const [messages, setMessages] = useState<any[]>([]);
    const currentUserId = auth.currentUser?.uid || "";

    useEffect(() => {
        if (groupId) {
            // Listen to group messages in real-time
            const unsubscribe = listenToMessages(groupId, true, setMessages);
            return () => unsubscribe();
        }
    }, [groupId]);

    const handleSendMessage = async (text: string) => {
        if (groupId && text.trim()) {
            await sendMessage(text, currentUserId, groupId, true);
        }
    };

    return (
        <div className="chat-container">
            {/* <h3 className="text-center">Group Chat</h3>
            <ChatBox messages={messages} currentUserId={currentUserId} />
            <MessageInput onSend={handleSendMessage} /> */}
        </div>
    );
};

export default GroupChat;
