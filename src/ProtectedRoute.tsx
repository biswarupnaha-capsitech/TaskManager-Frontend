import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthProvider";

interface Props {
    children: React.ReactElement;
}

export default function ProtectedRoute({ children }: Props) {
    const { token } = useAuth();
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
}