import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile, getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await updateProfile(userCredential.user, {
        displayName: form.name
      });
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0b0c1e] text-white">
      <form onSubmit={handleSubmit} className="bg-[#131426] p-8 rounded-md shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-neonPurple">Signup</h2>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 bg-gray-800 rounded text-white"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 bg-gray-800 rounded text-white"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 bg-gray-800 rounded text-white"
        />
        {error && <p className="text-red-400 mb-2">{error}</p>}
        <button type="submit" className="w-full bg-neonBlue text-black py-2 rounded font-semibold">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignupPage;