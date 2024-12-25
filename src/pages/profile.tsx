import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import { updateProfile, updateEmail, updatePassword } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Container, Form, Button, Toast, ToastContainer } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";

const Profile: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [editMode, setEditMode] = useState<boolean>(false); // State for edit mode
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    setUsername(user.displayName || "");
                    setEmail(user.email || "");

                    // Optional: Fetch more details from Firestore
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        if (userData.username) setUsername(userData.username);
                    }
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        fetchUserDetails();
    }, []);

    const handleUpdateProfile = async () => {
        if (!username.trim()) {
            setError("Username cannot be empty.");
            return;
        }
        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
            setError("A valid email is required.");
            return;
        }

        try {
            const user = auth.currentUser;
            if (user) {
                // Update username in Firebase Authentication
                await updateProfile(user, { displayName: username });

                // Update email if changed
                if (email !== user.email) {
                    await updateEmail(user, email);
                }

                // Update password if provided
                if (password.trim()) {
                    await updatePassword(user, password);
                }

                // Optional: Update Firestore
                const userDoc = doc(db, "users", user.uid);
                await updateDoc(userDoc, { username, email });

                setSuccess("Profile updated successfully!");
                setEditMode(false); // Exit edit mode
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            setError("An error occurred while updating your profile. Please try again.");
        }
    };

    return (
        <Container fluid className="vh-100 d-flex justify-content-center align-items-center bg-light">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
                <AnimatePresence>
                    {editMode ? (
                        // Edit Mode Card
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="p-4 shadow rounded bg-white"
                            style={{ width: "100%", maxWidth: "500px" }}
                        >
                            <h3 className="text-center mb-4">Edit Your Profile</h3>

                            {error && (
                                <ToastContainer position="top-center" className="p-3">
                                    <Toast onClose={() => setError(null)} show={!!error} bg="danger" delay={3000} autohide>
                                        <Toast.Body>{error}</Toast.Body>
                                    </Toast>
                                </ToastContainer>
                            )}

                            {success && (
                                <ToastContainer position="top-center" className="p-3">
                                    <Toast
                                        onClose={() => setSuccess(null)}
                                        show={!!success}
                                        bg="success"
                                        delay={3000}
                                        autohide
                                    >
                                        <Toast.Body>{success}</Toast.Body>
                                    </Toast>
                                </ToastContainer>
                            )}

                            <Form>
                                <Form.Group className="mb-3" controlId="formUsername">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formPassword">
                                    <Form.Label>Change Password (Optional)</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter a new password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <Form.Text className="text-muted">
                                        Leave this blank if you don't want to change your password.
                                    </Form.Text>
                                </Form.Group>

                                <div className="d-grid">
                                    <Button variant="primary" size="lg" onClick={handleUpdateProfile}>
                                        Save Changes
                                    </Button>
                                </div>
                            </Form>

                            <p className="text-center mt-3 text-muted">
                                <span
                                    onClick={() => setEditMode(false)}
                                    style={{
                                        cursor: "pointer",
                                        textDecoration: "underline",
                                        color: "blue",
                                    }}
                                >
                                    Cancel
                                </span>
                            </p>
                        </motion.div>
                    ) : (
                        // View Mode
                        <motion.div
                            initial={{ opacity: 0, y: -30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="p-4"
                        >
                            <h1 className="fw-bold">Your Profile</h1>
                            <motion.p
                                className="lead"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                <strong>Username:</strong> {username}
                            </motion.p>
                            <motion.p
                                className="lead"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                            >
                                <strong>Email:</strong> {email}
                            </motion.p>

                            <motion.button
                                className="btn btn-primary btn-lg mt-4"
                                whileHover={{ scale: 1.1 }}
                                onClick={() => setEditMode(true)}
                            >
                                Edit Profile
                            </motion.button>

                            <p className="mt-3">
                                <span
                                    onClick={() => navigate("/chat")}
                                    style={{
                                        cursor: "pointer",
                                        textDecoration: "underline",
                                        color: "blue",
                                    }}
                                >
                                    Back to Chat
                                </span>
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </Container>
    );
};

export default Profile;
