import React, { useEffect, useRef } from "react";

interface ChatBoxProps {
    messages: any[];
    currentUserId: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages, currentUserId }) => {
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // Scroll to the bottom whenever messages are updated
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <div className="p-3" style={{ maxHeight: "70vh", overflowY: "auto" }}>
            {messages.map((msg) => (
                <div
                    key={msg.id}
                    className={`d-flex flex-column ${msg.senderId === currentUserId ? "align-items-end" : "align-items-start"
                        } mb-3`}
                >
                    <div
                        className={`p-2 rounded shadow-sm ${msg.senderId === currentUserId ? "bg-primary text-white" : "bg-light text-dark"
                            }`}
                        style={{ maxWidth: "60%", wordWrap: "break-word" }}
                    >
                        {msg.text}
                    </div>
                    <small className="text-muted mt-1">
                        {new Date(msg.createdAt?.seconds * 1000).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </small>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatBox;
