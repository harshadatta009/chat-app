import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const UsersList: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const currentUser = auth.currentUser;

                if (currentUser) {
                    // Query Firestore to get all users except the current user
                    const q = query(
                        collection(db, "users"),
                        where("uid", "!=", currentUser.uid)
                    );

                    const querySnapshot = await getDocs(q);

                    const fetchedUsers = querySnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));

                    setUsers(fetchedUsers);
                    console.log(fetchUsers);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleStartChat = (userId: string) => {
        navigate(`/chat/${userId}`);
    };

    if (loading) {
        return <div>Loading users...</div>;
    }

    return (
        <div className="container mt-4">
            <h3>Select a User to Chat</h3>
            {users.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <ul className="list-group">
                    {users.map((user) => (
                        <li
                            key={user.id}
                            className="list-group-item d-flex justify-content-between align-items-center"
                        >
                            {user.username || "Unnamed User"}
                            <button
                                className="btn btn-primary"
                                onClick={() => handleStartChat(user.id)}
                            >
                                Chat
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UsersList;
