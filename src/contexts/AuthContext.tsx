"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { MOCK_USER, mockDelay, type MockUser } from "@/lib/mock-data";

interface AuthContextType {
  user: MockUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Verificar se há usuário "logado" no localStorage
  useEffect(() => {
    const checkAuth = async () => {
      await mockDelay(300); // Simular delay de API

      if (typeof window !== "undefined") {
        try {
          const storedUser = localStorage.getItem("mock-user");
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
          }
        } catch (error) {
          // Dados corrompidos no localStorage - limpar
          localStorage.removeItem("mock-user");
          console.error("Erro ao carregar usuário:", error);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string) => {
    await mockDelay(500); // Simular delay de API

    // Qualquer email/senha funciona no modo mock
    const mockUser = { ...MOCK_USER, email };
    if (typeof window !== "undefined") {
      localStorage.setItem("mock-user", JSON.stringify(mockUser));
    }
    setUser(mockUser);
  };

  const register = async (email: string, _password: string, name: string) => {
    await mockDelay(500); // Simular delay de API

    const mockUser = { ...MOCK_USER, email, name };
    if (typeof window !== "undefined") {
      localStorage.setItem("mock-user", JSON.stringify(mockUser));
    }
    setUser(mockUser);
  };

  const logout = async () => {
    await mockDelay(300); // Simular delay de API

    if (typeof window !== "undefined") {
      localStorage.removeItem("mock-user");
    }
    setUser(null);
    router.push("/login");
  };

  const refreshUser = async () => {
    await mockDelay(300);
    if (typeof window !== "undefined") {
      try {
        const storedUser = localStorage.getItem("mock-user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        // Dados corrompidos - limpar e resetar
        localStorage.removeItem("mock-user");
        setUser(null);
        console.error("Erro ao atualizar usuário:", error);
      }
    }
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
