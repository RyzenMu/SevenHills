import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/sevenHills2.png";

// CookieManager utility class
class CookieManager {
  static set(name: string, value: string, days?: number): void {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/`;
  }

  static get(name: string): string | null {
    const nameEQ = name + "=";
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(nameEQ)) {
        return decodeURIComponent(cookie.substring(nameEQ.length));
      }
    }
    return null;
  }

  static delete(name: string): void {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
  }
}

const Header: React.FC = () => {
  const { isAuthenticated, userEmail, token, setAuthData } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSignup, setShowSignup] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Load saved credentials from cookies on component mount
  useEffect(() => {
    const savedEmail = CookieManager.get("userEmail");
    const savedPassword = CookieManager.get("userPassword");
    
    if (savedEmail) setEmail(savedEmail);
    if (savedPassword) setPassword(savedPassword);
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    const res = await fetch("https://sevenhills-backend.onrender.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setIsLoading(false);
    
    if (res.ok) {
      // Save credentials to cookies on successful login (7 days expiry)
      CookieManager.set("userEmail", email, 7);
      CookieManager.set("userPassword", password, 7);
      
      setAuthData(data.session.access_token, data.user.email);
      navigate("/hero");
    } else {
      alert(data.error || "Login failed");
    }
  };

  const handleSignup = async () => {
    setIsLoading(true);
    const res = await fetch("https://sevenhills-backend.onrender.com/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setIsLoading(false);
    
    if (res.ok) {
      // Save credentials to cookies on successful signup (7 days expiry)
      CookieManager.set("userEmail", email, 7);
      CookieManager.set("userPassword", password, 7);
      
      setAuthData(data.session.access_token, data.user.email);
      navigate("/hero");
      setShowSignup(false);
    } else {
      alert(data.error || "Signup failed");
    }
  };

  const handleLogout = async () => {
    if (!token) return;
    await fetch("https://sevenhills-backend.onrender.com/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    
    // Clear cookies on logout
    CookieManager.delete("userEmail");
    CookieManager.delete("userPassword");
    
    setAuthData(null, null);
    navigate("/");
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

            {!showSignup ? (
              <>
                <button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading...</span>
                    </div>
                  ) : (
                    "Login"
                  )}
                </button>
                <button
                  onClick={() => setShowSignup(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  Signup
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSignup}
                  disabled={isLoading}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading...</span>
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </button>
                <button
                  onClick={() => setShowSignup(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </>
            )}
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