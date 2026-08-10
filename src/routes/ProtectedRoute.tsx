import { Navigate } from "react-router-dom";
import { useAppSelector } from "../app/store";

interface Props {
    children: React.ReactElement;
}

export default function ProtectedRoute({ children }: Props) {
    const token = useAppSelector(state => state.auth.token);
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
}