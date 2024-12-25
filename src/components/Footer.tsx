import React from "react";
import { Container } from "react-bootstrap";

const Footer: React.FC = () => {
    return (
        <footer className="py-3 bg-light mt-auto">
            <Container>
                <p className="text-center text-muted mb-0">
                    &copy; {new Date().getFullYear()} Chat-App. All Rights Reserved.
                </p>
            </Container>
        </footer>
    );
};

export default Footer;
