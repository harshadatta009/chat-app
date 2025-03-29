import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../firebase/auth";
import { Container, Form, Button, Toast, ToastContainer, InputGroup } from "react-bootstrap";
import { motion } from "framer-motion";
import { Eye, EyeSlash } from "react-bootstrap-icons";

const Signup: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSignup = async () => {
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
            setTimeout(() => navigate("/"), 3000);
        } catch (error) {
            console.error("Signup error:", error);
            setError("An error occurred during signup. Please try again.");
        }
    };

    return (
        <Container fluid className="vh-100 d-flex justify-content-center align-items-center bg-light">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-4 shadow-lg rounded-4 bg-white"
                style={{ width: "100%", maxWidth: "400px" }}
            >
                <h2 className="text-center mb-4 text-primary fw-bold">Create an Account</h2>

                <ToastContainer position="top-center" className="p-3">
                    {error && (
                        <Toast onClose={() => setError(null)} show={!!error} bg="danger" delay={3000} autohide>
                            <Toast.Body className="text-white fw-semibold">{error}</Toast.Body>
                        </Toast>
                    )}
                    {success && (
                        <Toast onClose={() => setSuccess(null)} show={!!success} bg="success" delay={3000} autohide>
                            <Toast.Body className="text-white fw-semibold">{success}</Toast.Body>
                        </Toast>
                    )}
                </ToastContainer>

                <Form>
                    <Form.Group className="mb-3" controlId="formUsername">
                        <Form.Label className="fw-semibold">Username</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="p-2 rounded-3"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label className="fw-semibold">Email Address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="p-2 rounded-3"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label className="fw-semibold">Password</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="p-2 rounded-start-3"
                            />
                            <Button
                                variant="outline-secondary"
                                className="rounded-end-3"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                            </Button>
                        </InputGroup>
                    </Form.Group>

                    <div className="d-grid">
                        <Button
                            variant="primary"
                            size="lg"
                            className="rounded-3 fw-semibold"
                            onClick={handleSignup}
                        >
                            Sign Up
                        </Button>
                    </div>
                </Form>

                <p className="text-center mt-3 text-muted">
                    Already have an account?{" "}
                    <span
                        onClick={() => navigate("/")}
                        style={{
                            cursor: "pointer",
                            textDecoration: "none",
                            color: "blue",
                            fontWeight: "bold",
                        }}
                        className="hover-underline-animation"
                    >
                        Login
                    </span>
                </p>
            </motion.div>
        </Container>
    );
};

export default Signup;
