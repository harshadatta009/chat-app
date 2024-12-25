import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Spinner, Button, Card, Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";

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
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <Container className="mt-4">
            <motion.h3
                className="text-center mb-4"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Select a User to Chat
            </motion.h3>
            {users.length === 0 ? (
                <motion.p
                    className="text-center text-muted"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    No users found.
                </motion.p>
            ) : (
                <Row className="g-4">
                    {users.map((user, index) => (
                        <Col md={6} lg={4} key={user.id}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: index * 0.1,
                                    duration: 0.5,
                                    ease: "easeOut",
                                }}
                            >
                                <Card className="shadow-sm border-0 rounded-3">
                                    <Card.Body className="d-flex flex-column align-items-center">
                                        <motion.div
                                            className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white mb-3"
                                            style={{
                                                width: "70px",
                                                height: "70px",
                                                fontSize: "1.5rem",
                                                fontWeight: "bold",
                                            }}
                                            whileHover={{
                                                scale: 1.2,
                                                rotate: 10,
                                            }}
                                        >
                                            {user.username.charAt(0).toUpperCase()}
                                        </motion.div>
                                        <Card.Title className="text-center text-capitalize fw-bold">
                                            {user.username || "Unnamed User"}
                                        </Card.Title>
                                        <Card.Text className="text-center text-muted">
                                            {user.email}
                                        </Card.Text>
                                        <motion.div whileHover={{ scale: 1.1 }}>
                                            <Button
                                                variant="primary"
                                                className="w-100 mt-2"
                                                onClick={() => handleStartChat(user.id)}
                                            >
                                                Chat
                                            </Button>
                                        </motion.div>
                                    </Card.Body>
                                </Card>
                            </motion.div>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default UsersList;
