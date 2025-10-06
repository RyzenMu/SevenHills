import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/sevenHills2.png";

const Header: React.FC = () => {
  const { isAuthenticated, userEmail, token, setAuthData } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await fetch("https://sevenhills-backend.onrender.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      setAuthData(data.session.access_token, data.user.email);
      navigate("/SevenHills/hero");
    } else {
      alert(data.error || "Login failed");
    }
  };

  const handleLogout = async () => {
    if (!token) return;
    await fetch("https://sevenhills-backend.onrender.com/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    setAuthData(null, null);
    navigate("/SevenHills");
  };

  return (
    <header className="bg-gray-400 p-4">
      <nav className="flex justify-between items-center flex-wrap gap-4">
        <div onClick={() => navigate("/")} className="cursor-pointer">
          <img src={logo} alt="logo" className="h-14 w-14 object-contain" />
        </div>

        {!isAuthenticated ? (
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <label htmlFor="email" className="text-sm font-medium text-gray-800">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="text-sm font-medium text-gray-800">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />
            </div>

            <button
              onClick={handleLogin}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Login
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-gray-900 font-medium">Welcome, {userEmail}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
