import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000/api/auth/register"
      : "https://mongo-db-production-262b.up.railway.app/api/auth/register";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        API_URL,
        formData,
      );

      // ── SAVE USER DATA & TOKEN ──
      // Ye line hamare 'Protect' routes ke liye pass ka kaam karegi
      localStorage.setItem("userInfo", JSON.stringify(data));

      toast.success(`Welcome back, ${data.name}!`);
      navigate("/");
      window.location.reload(); // App ko refresh karein taake Navbar update ho jaye
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
      <h2 className="text-3xl font-black text-gray-800 mb-6 text-center">
        Login
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          required
          className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          required
          className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="mt-6 text-center text-gray-500">
        New here?{" "}
        <Link to="/register" className="text-blue-600 font-bold">
          Register Now
        </Link>
      </p>
    </div>
  );
}
