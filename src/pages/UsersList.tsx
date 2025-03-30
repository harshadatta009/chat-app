import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { ListGroup, Container, Button } from "react-bootstrap";
import ChatPage from "./ChatPage";

const UsersList: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [groups, setGroups] = useState<any[]>([]);
    const [selectedChat, setSelectedChat] = useState<{ type: "user" | "group"; id: string } | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsersAndGroups = async () => {
            try {
                const user = auth.currentUser;
                if (!user) return;

                // Fetch users (excluding current user)
                const usersQuery = query(collection(db, "users"));
                const usersSnapshot = await getDocs(usersQuery);
                const fetchedUsers = usersSnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(u => u.id !== user.uid);

                setUsers(fetchedUsers);

                // Fetch groups where the current user is a participant
                const groupsQuery = query(collection(db, "groups"), where("participants", "array-contains", user.uid));
                const groupsSnapshot = await getDocs(groupsQuery);
                const fetchedGroups = groupsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                setGroups(fetchedGroups);
            } catch (error) {
                console.error("Error fetching users or groups:", error);
            }
        };

        fetchUsersAndGroups();
    }, []);

    return (
        <Container fluid className="d-flex vh-100">
            {/* Left Sidebar - Users & Groups List */}
            <div className="border-end p-3" style={{ width: "30%", overflowY: "auto", backgroundColor: "#f8f9fa" }}>
                <h5>Users</h5>
                <ListGroup>
                    {users.length > 0 ? (
                        users.map(user => (
                            <ListGroup.Item
                                key={user.id}
                                className={`d-flex justify-content-between align-items-center ${selectedChat?.type === "user" && selectedChat?.id === user.id ? "active" : ""}`}

                                onClick={() => setSelectedChat({ type: "user", id: user.id })}
                                style={{ cursor: "pointer" }}
                            >
                                <div
                                    className="rounded-circle d-flex align-items-center justify-content-center text-white me-3"
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        backgroundColor: "#007bff",
                                        fontSize: "18px",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {user.username?.charAt(0).toUpperCase()}
                                </div>
                                {user.username}
                            </ListGroup.Item>
                        ))
                    ) : (
                        <p className="text-center text-muted">No users found</p>
                    )}
                </ListGroup>

                <hr />

                <h5>Group Chats</h5>
                <ListGroup>
                    {groups.length > 0 ? (
                        groups.map(group => (
                            <ListGroup.Item
                                key={group.id}
                                className={`d-flex justify-content-between align-items-center ${selectedChat?.type === "group" && selectedChat?.id === group.id ? "active" : ""}`}
                                onClick={() => setSelectedChat({ type: "group", id: group.id })}
                                style={{ cursor: "pointer" }}
                            >
                                {/* Circular Avatar */}
                                <div
                                    className="rounded-circle d-flex align-items-center justify-content-center text-white me-3"
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        backgroundColor: "#28a745",
                                        fontSize: "18px",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {group.groupName?.charAt(0).toUpperCase()}
                                </div>
                                {group.groupName}
                            </ListGroup.Item>
                        ))
                    ) : (
                        <p className="text-center text-muted">No groups found</p>
                    )}
                </ListGroup>

                <Button className="mt-3 w-100" variant="primary" onClick={() => navigate("/create-group")}>
                    + Create Group Chat
                </Button>
            </div>

            {/* Right Panel - Chat Window */}
            <div className="flex-grow-1">
                {selectedChat ? (
                    selectedChat.type === "user" ? (
                        <ChatPage userId={selectedChat.id} />
                    ) : (
                        <ChatPage groupId={selectedChat.id} />
                    )
                ) : (
                    <p className="text-center mt-5">Select a user or group to chat</p>
                )}
            </div>
        </Container>
    );
};

export default UsersList;
