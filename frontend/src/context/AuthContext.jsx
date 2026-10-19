import { createContext, useContext, useState } from "react";
import backend from "../services/backend.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  const saveSession = ({ token, id, name, email }) => {
    const u = { id, name, email };
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(u));
    setUser(u);
  };

  const login = async (email, password) => {
    const { data } = await backend.post("/auth/login", { email, password });
    saveSession(data);
  };

  const register = async (name, email, password) => {
    const { data } = await backend.post("/auth/register", { name, email, password });
    saveSession(data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
