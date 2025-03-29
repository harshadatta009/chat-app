import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Button, ListGroup, Container } from "react-bootstrap";

const UsersList: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [groups, setGroups] = useState<any[]>([]);
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
                    .filter(u => u.id !== user.uid); // Exclude current user

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
        <Container className="mt-4">
            <h3 className="text-center mb-3">Users & Group Chats</h3>

            {/* Users List */}
            <h5>Users</h5>
            <ListGroup className="mb-4">
                {users.length > 0 ? (
                    users.map(user => (
                        <ListGroup.Item key={user.id} className="d-flex justify-content-between align-items-center">
                            {user.username}
                            <Button variant="primary" onClick={() => navigate(`/chat/${user.id}`)}>
                                Start Chat
                            </Button>
                        </ListGroup.Item>
                    ))
                ) : (
                    <p className="text-center text-muted">No users found</p>
                )}
            </ListGroup>

            {/* Groups List */}
            <h5>Group Chats</h5>
            <ListGroup>
                {groups.length > 0 ? (
                    groups.map(group => (
                        <ListGroup.Item key={group.id} className="d-flex justify-content-between align-items-center">
                            {group.groupName}
                            <Button variant="success" onClick={() => navigate(`/group-chat/${group.id}`)}>
                                Join Chat
                            </Button>
                        </ListGroup.Item>
                    ))
                ) : (
                    <p className="text-center text-muted">No group chats available</p>
                )}
            </ListGroup>

            {/* Create Group Button (Right-aligned) */}
            <div className="d-flex justify-content-end mt-3">
                <Button variant="success" onClick={() => navigate("/create-group")}>
                    Create Group Chat
                </Button>
            </div>
        </Container>
    );
};

export default UsersList;
