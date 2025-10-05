import React, { useState, useEffect } from "react";
import logo from "../assets/sevenHills2.png";

type HeaderProps = {};

const Header: React.FC<HeaderProps> = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // ✅ new state

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    if (savedToken) {
      setToken(savedToken);
    } else {
      setLoading(false); // no token, stop loading
    }
  }, []);

  // Whenever token changes, verify user
  useEffect(() => {
    if (token) {
      setLoading(true);
      fetch("https://sevenhills-backend.onrender.com/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setIsAuthenticated(true);
            setUserEmail(data.user.email);
          } else {
            setIsAuthenticated(false);
            setUserEmail(null);
          }
        })
        .catch(() => {
          setIsAuthenticated(false);
          setUserEmail(null);
        })
        .finally(() => setLoading(false)); // ✅ stop loading
    }
  }, [token]);

  const handleSignup = async () => {
    try {
      const res = await fetch("https://sevenhills-backend.onrender.com/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Signup successful! Check your email for verification.");
      } else {
        alert(data.error || "Signup failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async () => {
    try {
      const res = await fetch("https://sevenhills-backend.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsAuthenticated(true);
        setToken(data.session.access_token);
        localStorage.setItem("authToken", data.session.access_token); // save JWT
        setUserEmail(data.user.email);
        alert("Login successful!");
      } else {
        alert(data.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    if (!token) return;
    try {
      const res = await fetch("https://sevenhills-backend.onrender.com/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setIsAuthenticated(false);
        setToken(null);
        setUserEmail(null);
        localStorage.removeItem("authToken"); // clear JWT
        alert("Logged out!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="bg-gray-400 p-4">
      <nav className="flex justify-between items-center">
        {/* Logo */}
        <div className="text-xl font-bold text-white cursor-pointer">
          <img src={logo} alt="logo" className="h-14 w-14 object-contain" />
        </div>

        {/* Auth Section */}
        <div className="flex space-x-4 items-center text-white">
          {loading ? (
            <span className="italic">Checking session...</span> // ✅ loading indicator
          ) : !isAuthenticated ? (
            <>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-2 py-1 rounded text-black"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-2 py-1 rounded text-black"
              />
              <button
                onClick={handleSignup}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Sign Up
              </button>
              <button
                onClick={handleLogin}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
              >
                Login
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <span className="font-semibold">Welcome, {userEmail}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
