"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // TODO: Verificar autenticação via API GET /auth/me
  useEffect(() => {
    const checkAuth = async () => {
      // TODO: Chamar API para verificar se usuário está autenticado
      // const response = await fetch('/api/auth/me')
      // if (response.ok) {
      //   const userData = await response.json()
      //   setUser(userData)
      // }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // TODO: Implementar login via API POST /auth/login
  const login = async (email: string, password: string) => {
    // const response = await fetch('/api/auth/login', {
    //   method: 'POST',
    //   body: JSON.stringify({ email, password })
    // })
    // const data = await response.json()
    // setUser(data.user)
    console.log("Login:", email, password);
  };

  // TODO: Implementar registro via API POST /auth/register
  const register = async (email: string, password: string, name: string) => {
    // const response = await fetch('/api/auth/register', {
    //   method: 'POST',
    //   body: JSON.stringify({ email, password, name })
    // })
    // const data = await response.json()
    // setUser(data.user)
    console.log("Register:", email, password, name);
  };

  // TODO: Implementar logout via API
  const logout = async () => {
    // await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null);
    router.push("/login");
  };

  // TODO: Implementar refresh via API GET /auth/me
  const refreshUser = async () => {
    // const response = await fetch('/api/auth/me')
    // if (response.ok) {
    //   const userData = await response.json()
    //   setUser(userData)
    // }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
