import {
    createContext,
    useContext,
    useMemo,
    useState
} from "react";
import type { AuthContextType } from "../common/types";


const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState(
        localStorage.getItem("tm-accessToken")
    );

    function login(token: string) {
        localStorage.setItem(
            "tm-accessToken",
            token
        );
        setToken(token);
    }

    function logout() {
        localStorage.removeItem(
            "tm-accessToken"
        );
        setToken(null);
    }

    const value = useMemo(() => ({
        token,
        login,
        logout
    }), [token]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );

}

export function useAuth() {
    return useContext(AuthContext);
}