import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { Button, Form, Container } from "react-bootstrap";

const CreateGroup: React.FC = () => {
    const [groupName, setGroupName] = useState("");
    const [users, setUsers] = useState<any[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "users"));
                const fetchedUsers = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setUsers(fetchedUsers);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    const handleCreateGroup = async () => {
        if (!groupName.trim()) return alert("Enter a group name!");

        try {
            const user = auth.currentUser;
            if (!user) throw new Error("User not authenticated");

            await addDoc(collection(db, "groups"), {
                groupName,
                participants: [user.uid, ...selectedUsers], // Include creator in participants
                createdAt: new Date(),
            });

            alert("Group created successfully!");
            navigate('/dashboard');
        } catch (error) {
            console.error("Error creating group:", error);
            alert("Failed to create group!");
        }
    };

    return (
        <Container className="mt-4">
            <h3 className="text-center mb-4">Create Group Chat</h3>

            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Group Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter group name"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Select Users</Form.Label>
                    {users.map((user) => (
                        <Form.Check
                            key={user.id}
                            type="checkbox"
                            label={user.username}
                            value={user.id}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setSelectedUsers([...selectedUsers, user.id]);
                                } else {
                                    setSelectedUsers(selectedUsers.filter((id) => id !== user.id));
                                }
                            }}
                        />
                    ))}
                </Form.Group>

                <Button variant="success" onClick={handleCreateGroup}>
                    Create Group
                </Button>
            </Form>
        </Container>
    );
};

export default CreateGroup;
