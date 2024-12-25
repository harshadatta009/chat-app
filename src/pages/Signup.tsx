import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../firebase/auth";
import { Container, Row, Col, Form, Button, Toast, ToastContainer } from "react-bootstrap";
import { motion } from "framer-motion";

const Signup: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSignup = async () => {
        // Basic validation
        if (!username.trim()) {
            setError("Username is required.");
            return;
        }
        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
            setError("A valid email is required.");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        try {
            await registerUser(email, password, username);
            setSuccess("Signup successful! Redirecting to login...");
            setTimeout(() => navigate("/"), 3000); // Navigate after 3 seconds
        } catch (error) {
            console.error("Signup error:", error);
            setError("An error occurred during signup. Please try again.");
        }
    };

    return (
        <Container fluid className="vh-100 d-flex justify-content-center align-items-center bg-light">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="p-4 shadow rounded bg-white"
                style={{ width: "100%", maxWidth: "400px" }}
            >
                <h3 className="text-center mb-4">Create an Account</h3>

                {error && (
                    <ToastContainer position="top-center" className="p-3">
                        <Toast onClose={() => setError(null)} show={!!error} bg="danger" delay={3000} autohide>
                            <Toast.Body>{error}</Toast.Body>
                        </Toast>
                    </ToastContainer>
                )}

                {success && (
                    <ToastContainer position="top-center" className="p-3">
                        <Toast onClose={() => setSuccess(null)} show={!!success} bg="success" delay={3000} autohide>
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
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>

                    <div className="d-grid">
                        <Button variant="primary" size="lg" onClick={handleSignup}>
                            Sign Up
                        </Button>
                    </div>
                </Form>

                <p className="text-center mt-3 text-muted">
                    Already have an account? <a href="/">Login</a>
                </p>
            </motion.div>
        </Container>
    );
};

export default Signup;
