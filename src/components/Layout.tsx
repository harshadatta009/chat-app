import React, { ReactNode } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="d-flex flex-column vh-100">
            <Navbar />
            <main className="flex-grow-1">{children}</main>
            <Footer />
        </div>
    );
};

export default Layout;
