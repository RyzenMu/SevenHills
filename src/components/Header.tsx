import React, { useState } from "react";
import logo from "../assets/sevenHills1.png"

type HeaderProps = {};

const Header: React.FC<HeaderProps> = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleSignup = () => {
    setIsAuthenticated(true);
  };

  return (
    <header className="bg-gray-400 p-4">
      <nav className="flex justify-between items-center">
        {/* Logo Section */}
        <div className="text-xl font-bold text-white cursor-pointer">
          <img src={logo} alt="logo" className="h-10 w-10 object-contain" />
        </div>

        {/* Auth Buttons */}
        <div className="flex space-x-4">
          {!isAuthenticated ? (
            <>
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
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
