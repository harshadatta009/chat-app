import React, { useState } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import { db, auth } from "../../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";

interface MessageInputProps {
    onSend: (message: string) => void;
    userId?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend, userId }) => {
    const [message, setMessage] = useState<string>("");
    const currentUser = auth.currentUser;
    let typingTimeout: NodeJS.Timeout;

    const handleTyping = async (isTyping: boolean) => {
        if (userId && currentUser) {
            const userDocRef = doc(db, "users", currentUser.uid);
            await updateDoc(userDocRef, { typing: isTyping });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);

        // Start typing event
        if (userId) {
            handleTyping(true);

            // Clear previous timeout and set a new one to reset typing after a delay
            clearTimeout(typingTimeout);
            typingTimeout = setTimeout(() => handleTyping(false), 2000);
        }
    };

    const handleSend = () => {
        if (!message.trim()) return;
        onSend(message);
        setMessage("");
    };

    return (
        <InputGroup className="p-3">
            <Form.Control
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={handleChange}
                className="shadow-sm"
            />
            <Button variant="primary" onClick={handleSend} className="ms-2 shadow-sm">
                Send
            </Button>
        </InputGroup>
    );
};

export default MessageInput;
