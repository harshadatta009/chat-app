import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Layout from "./Layout";

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
                <p>Loading...</p>
            </div>
        );
    }

    return user ? <Layout>{children}</Layout> : <Navigate to="/" />;
};

export default ProtectedRoute;
