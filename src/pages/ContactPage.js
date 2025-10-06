import React, { useState } from 'react';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thanks for your message! We’ll get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-gray-900 rounded-xl shadow-lg text-white">
      <h2 className="text-2xl font-bold mb-6 text-neonPurple">Contact Us</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Your name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-800 text-white"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-800 text-white"
          required
        />
        <textarea
          name="message"
          placeholder="Your message"
          value={formData.message}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-800 text-white"
          rows="5"
          required
        />
        <button
          type="submit"
          className="bg-neonBlue text-black font-semibold px-6 py-2 rounded hover:bg-white"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ContactPage;