import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import ChatPage from '../pages/ChatPage';
import ProtectedRoute from '../components/ProtectedRoute';
import PublicRoute from '../components/PublicRoute';
import Profile from '../pages/profile';
import UsersList from '../pages/UsersList';
const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <PublicRoute>
                <Login />
            </PublicRoute>
        )
    },
    {
        path: '/signup',
        element: (
            <PublicRoute>
                <Signup />
            </PublicRoute>
        )
    },
    {
        path: "/users",
        element: (
            <ProtectedRoute>
                <UsersList />
            </ProtectedRoute>
        ),
    },
    {
        path: "/chat/:userId",
        element: (
            <ProtectedRoute>
                <ChatPage />
            </ProtectedRoute>
        ),
    },
    {
        path: '/profile',
        element: (
            <ProtectedRoute>
                <Profile />
            </ProtectedRoute>
        )
    },

])
const AppRouter: React.FC = () => {
    return <RouterProvider router={router} />;
}

export default AppRouter