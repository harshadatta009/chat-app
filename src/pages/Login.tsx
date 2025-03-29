import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../firebase/auth";
import { Container, Form, Button, Alert, InputGroup } from "react-bootstrap";
import { motion } from "framer-motion";
import { Eye, EyeSlash } from "react-bootstrap-icons";

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            await loginUser(email, password);
            navigate("/users");
            console.log("Login successful. Navigating to /users...");
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
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-4 shadow-lg rounded-4 bg-white"
                style={{ width: "100%", maxWidth: "400px" }}
            >
                <h2 className="text-center mb-4 text-primary fw-bold">Welcome Back</h2>

                {error && <Alert variant="danger" className="text-center">{error}</Alert>}

                <Form>
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
                            onClick={handleLogin}
                        >
                            Login
                        </Button>
                    </div>
                </Form>

                <p className="text-center mt-3 text-muted">
                    Don't have an account?{" "}
                    <span
                        onClick={() => navigate("/signup")}
                        style={{
                            cursor: "pointer",
                            textDecoration: "none",
                            color: "blue",
                            fontWeight: "bold",
                        }}
                        className="hover-underline-animation"
                    >
                        Signup
                    </span>
                </p>
            </motion.div>
        </Container>
    );
};

export default Login;
