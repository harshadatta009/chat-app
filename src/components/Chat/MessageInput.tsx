import React, { useState } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";

interface MessageInputProps {
    onSend: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
    const [message, setMessage] = useState<string>("");

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
                onChange={(e) => setMessage(e.target.value)}
                className="shadow-sm"
            />
            <Button variant="primary" onClick={handleSend} className="ms-2 shadow-sm">
                Send
            </Button>
        </InputGroup>
    );
};

export default MessageInput;
