// src/contexts/AuthContext.tsx
import React, { createContext, useState, useContext, ReactNode } from "react";
import api from "../services/api";

interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const token = response.data.token;
      localStorage.setItem("token", token);

      const userResponse = await api.get("/users/userDetails");
      setUser(userResponse.data);
    } catch (error) {
      console.error(error);
      alert("Login failed!");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const register = async (email: string, password: string) => {
    try {
      await api.post("/auth/register", { email, password });
      alert("Registration successful! Please log in.");
    } catch (error) {
      console.error(error);
      alert("Registration failed!");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
