import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthCtx = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. BASE_URL ko fix karein (endpoint hata dein)
  const BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000/api/auth"
      : "https://mongo-db-production-262b.up.railway.app/api/auth";

  useEffect(() => {
    const savedUser = localStorage.getItem("userInfo");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // 2. Login Function mein endpoint sahi karein
  const login = async (email, password) => {
    // Yahan BASE_URL + "/login" hoga
    const { data } = await axios.post(`${BASE_URL}/login`, {
      email,
      password,
    });
    setUser(data);
    localStorage.setItem("userInfo", JSON.stringify(data));
    return data;
  };

  // Logout Function
  const logout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
