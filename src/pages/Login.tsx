import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../firebase/auth";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { motion } from "framer-motion";
const Login: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            await loginUser(email, password);
            navigate("/users");
            console.log("Login successful. Navigating to /users...");
            console.log("Firebase API Key:", process.env.REACT_APP_FIREBASE_API_KEY);

        } catch (error: any) {
            if (error.code === "auth/user-not-found") {
                setError("No user found with this email. Please register.");
            } else if (error.code === "auth/wrong-password") {
                setError("Incorrect password. Please try again.");
            } else if (error.code === "auth/invalid-email") {
                setError("Invalid email format.");
            } else {
                console.error("Login error:", error);
                setError("An error occurred. Please try again.");
            }
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
                <h3 className="text-center mb-4">Welcome Back!</h3>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form>
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
                        <Button variant="primary" size="lg" onClick={handleLogin}>
                            Login
                        </Button>
                    </div>
                </Form>

                <p className="text-center mt-3 text-muted">
                    Don't have an account? <a href="/signup">Sign up</a>
                </p>
            </motion.div>
        </Container>
    );
};

export default Login;
