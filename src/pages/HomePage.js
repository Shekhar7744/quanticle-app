import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-screen bg-gradient-to-b from-black to-gray-900 text-white p-6">
      <h1 className="text-4xl md:text-6xl font-bold text-neonPurple mb-4">Welcome to Quanticle</h1>
      <p className="text-lg md:text-xl mb-8 max-w-xl">
        A cosmic realm where physics meets imagination. Share your deepest insights and unravel the universe together.
      </p>
      <Link to="/explore" className="bg-neonBlue text-black px-6 py-3 rounded-xl font-bold hover:bg-white transition">
        Explore Now
      </Link>
    </div>
  );
};

export default HomePage;