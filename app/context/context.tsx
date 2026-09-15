"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";

import axios from "axios";
import { useRouter } from "next/navigation";

type Admin = {
    username: string;
    email: string;
};

type AuthContextType = {
    admin: Admin | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

export function AuthProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [admin, setAdmin] = useState<Admin | null>(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    // =========================
    // Check Authentication
    // =========================
    const checkAuth = async (): Promise<boolean> => {
        try {
            const response = await axios.get("/api/auth/me");

            if (
                response.data.success &&
                response.data.admin
            ) {
                setAdmin({
                    username: response.data.admin.username,
                    email: response.data.admin.email,
                });

                return true;
            }

            setAdmin(null);
            return false;

        } catch (error) {
            // 401 / expired JWT / invalid JWT
            setAdmin(null);
            return false;
        }
    };

    // =========================
    // Initial Authentication Check
    // =========================
    useEffect(() => {
        const initializeAuth = async () => {
            const authenticated = await checkAuth();

            if (!authenticated) {
                router.push("/admin/log-in");
            }

            setLoading(false);
        };

        initializeAuth();
    }, []);

    // =========================
    // Login
    // =========================
    const login = async (
        email: string,
        password: string
    ): Promise<boolean> => {
        try {
            const response = await axios.post(
                "/api/auth/log-in",
                {
                    email,
                    password,
                }
            );

            if (!response.data.success) {
                return false;
            }else{
                router.push("/admin")
            }

            /*
             * JWT is stored by the server
             * inside the httpOnly cookie.
             *
             * We don't access the JWT here.
             */

            const authenticated = await checkAuth();

            if (!authenticated) {
                return false;
            }

            return true;

        } catch (error) {
            console.error("Login failed:", error);

            return false;
        }
    };

    // =========================
    // Logout
    // =========================
    const logout = async () => {
        try {
            await axios.post("/api/auth/log-out");
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setAdmin(null);
            router.push("/admin/log-in");
        }
    };

    return (
        <AuthContext.Provider
            value={{
                admin,
                loading,
                isAuthenticated: !!admin,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// =========================
// Custom Hook
// =========================
export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}

