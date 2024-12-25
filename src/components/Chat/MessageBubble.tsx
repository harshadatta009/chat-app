import React from "react";
import { Badge } from "react-bootstrap";

interface MessageBubbleProps {
    text: string;
    username: string;
    isCurrentUser: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ text, username, isCurrentUser }) => {
    return (
        <div className={`d-flex ${isCurrentUser ? "justify-content-end" : "justify-content-start"} mb-3`}>
            <div
                className={`p-3 rounded-3 shadow-sm ${isCurrentUser ? "bg-primary text-white" : "bg-light"
                    }`}
                style={{ maxWidth: "60%" }}
            >
                {!isCurrentUser && <Badge className="text-dark mb-1">{username}</Badge>}
                <div>{text}</div>
            </div>
        </div>
    );
};

export default MessageBubble;
