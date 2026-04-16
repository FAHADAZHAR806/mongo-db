import axios from "axios";

const API = axios.create({
  // Aapka backend URL
  baseURL: "http://localhost:5000/api",
});

// ── THE SECURITY GUARD (Interceptor) ──
// Yeh har request se pehle check karega ke kya token para hai?
API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem("userInfo");

  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    // Yeh line automatically header mein Token laga degi
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;
