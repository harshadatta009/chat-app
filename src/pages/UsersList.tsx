import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { ListGroup, Container } from "react-bootstrap";
import { motion } from "framer-motion";
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

                const usersQuery = query(collection(db, "users"));
                const usersSnapshot = await getDocs(usersQuery);
                const fetchedUsers = usersSnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(u => u.id !== user.uid);
                setUsers(fetchedUsers);

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
            <motion.div
                className="border-end p-3"
                style={{ width: "30%", overflowY: "auto", backgroundColor: "#f8f9fa" }}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h5>Users</h5>
                <ListGroup>
                    {users.length > 0 ? (
                        users.map((user, index) => (
                            <motion.div
                                key={user.id}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <ListGroup.Item
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
                            </motion.div>
                        ))
                    ) : (
                        <p className="text-center text-muted">No users found</p>
                    )}
                </ListGroup>

                <hr />

                <h5>Group Chats</h5>
                <ListGroup>
                    {groups.length > 0 ? (
                        groups.map((group, index) => (
                            <motion.div
                                key={group.id}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <ListGroup.Item
                                    className={`d-flex justify-content-between align-items-center ${selectedChat?.type === "group" && selectedChat?.id === group.id ? "active" : ""}`}
                                    onClick={() => setSelectedChat({ type: "group", id: group.id })}
                                    style={{ cursor: "pointer" }}
                                >
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
                            </motion.div>
                        ))
                    ) : (
                        <p className="text-center text-muted">No groups found</p>
                    )}
                </ListGroup>

                <motion.button
                    className="mt-3 w-100 btn btn-primary"
                    onClick={() => navigate("/create-group")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    + Create Group Chat
                </motion.button>
            </motion.div>

            <div className="flex-grow-1">
                {selectedChat ? (
                    selectedChat.type === "user" ? (
                        <ChatPage userId={selectedChat.id} />
                    ) : (
                        <ChatPage groupId={selectedChat.id} />
                    )
                ) : (
                    <motion.p
                        className="text-center mt-5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        Select a user or group to chat
                    </motion.p>
                )}
            </div>
        </Container>
    );
};

export default UsersList;
