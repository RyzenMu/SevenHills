import React, { useState } from "react";

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
      <nav className="flex justify-end space-x-4">
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
      </nav>
    </header>
  );
};

export default Header;
