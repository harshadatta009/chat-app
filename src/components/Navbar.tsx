import React from "react";
import { Container, Navbar as BootstrapNavbar, Button, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../firebase/auth";

const Navbar: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logoutUser();
            navigate("/"); // Redirect to login page after logout
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <BootstrapNavbar bg="light" className="shadow-sm">
            <Container>
                {/* Navbar Brand */}
                <BootstrapNavbar.Brand onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                    Chat-App
                </BootstrapNavbar.Brand>

                {/* Profile and Logout Section */}
                <Nav className="ms-auto d-flex align-items-center">
                    {/* Profile Icon */}
                    <i
                        className="bi bi-person-circle text-primary"
                        style={{
                            fontSize: "1.8rem",
                            cursor: "pointer",
                            marginRight: "15px",
                        }}
                        onClick={() => navigate("/profile")}
                    ></i>

                    {/* Logout Button */}
                    <Button variant="outline-danger" onClick={handleLogout}>
                        Logout
                    </Button>
                </Nav>
            </Container>
        </BootstrapNavbar>
    );
};

export default Navbar;
