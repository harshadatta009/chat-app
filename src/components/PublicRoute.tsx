import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

interface PublicRouteProps {
    children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
                <p>Loading...</p>
            </div>
        );
    }

    return user ? <Navigate to="/dashboard" /> : <>{children}</>;
};

export default PublicRoute;
