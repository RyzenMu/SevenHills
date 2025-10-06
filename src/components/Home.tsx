import React from "react";

const Home: React.FC = () => {
  return (
    <section className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-green-400 to-blue-500 text-white text-center">
      <h1 className="text-6xl font-bold mb-4">Welcome to Seven Hills</h1>
      <p className="text-xl mb-8">Please sign up or log in to continue</p>
      <div className="text-lg opacity-90">
        <p>Create an account or sign in using the form above</p>
      </div>
    </section>
  );
};

export default Home;