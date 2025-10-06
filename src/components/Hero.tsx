import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Hero: React.FC = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center">
        <h2>Please log in to view this page.</h2>
        <button onClick={() => navigate("/SevenHills")}>Go to Login</button>
      </div>
    );
  }

  return (
    <section className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-blue-400 to-purple-500 text-white text-center">
      <h1 className="text-5xl font-bold mb-4">This is Hero Page</h1>
      <p className="text-lg">Welcome to the main content area!</p>
    </section>
  );
};

export default Hero;
