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
      navigate("/hero");
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
    navigate("/");
  };

  return (
    <header className="bg-gray-400 p-4">
      <nav className="flex justify-between items-center">
        <div onClick={() => navigate("/")} className="cursor-pointer">
          <img src={logo} alt="logo" className="h-14 w-14 object-contain" />
        </div>
        {!isAuthenticated ? (
          <>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
          </>
        ) : (
          <>
            <span>Welcome, {userEmail}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
