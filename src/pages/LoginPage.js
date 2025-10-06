import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/contribute');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-cosmic text-white flex justify-center items-center">
      <form onSubmit={handleLogin} className="bg-gray-900 p-8 rounded-xl shadow-md w-80 space-y-4">
        <h2 className="text-2xl font-bold text-center text-neonPurple">Log In</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 rounded bg-gray-800 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 rounded bg-gray-800 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-neonPurple text-white py-2 rounded">Log In</button>
      </form>
    </div>
  );
}

export default LoginPage;