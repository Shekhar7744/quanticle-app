import React, { useState } from 'react';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { storage, db } from '../firebase';
import { getAuth } from 'firebase/auth';
import toast, { Toaster } from 'react-hot-toast';

const ContributePage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !file) {
      toast.error('Please fill in all fields and select a file.');
      return;
    }

    setSubmitting(true);

    try {
      const fileName = `${Date.now()}_${file.name}`;
      const fileRef = storageRef(storage, `uploads/${fileName}`);
      await uploadBytes(fileRef, file);
      const fileURL = await getDownloadURL(fileRef);

      const auth = getAuth();
      const user = auth.currentUser;

      await addDoc(collection(db, 'sandbox_contributions'), {
        title,
        description,
        fileURL,
        contributorEmail: user?.email || 'anonymous',
        createdAt: serverTimestamp(),
        approved: true // ✅ Auto-approve
      });

      setTitle('');
      setDescription('');
      setFile(null);
      toast.success('Simulation submitted and auto-approved!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 text-white max-w-3xl mx-auto">
      <Toaster position="top-center" reverseOrder={false} />
      <h2 className="text-3xl font-bold text-neonBlue mb-6">Contribute Simulation</h2>

      <form onSubmit={handleSubmit} className="space-y-4 bg-[#1a1c2e] p-6 rounded-lg border border-gray-700">
        <input
          type="text"
          placeholder="Simulation Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 rounded bg-[#131426] text-white border border-gray-600"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 rounded bg-[#131426] text-white border border-gray-600"
          rows={6}
          required
        />
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="text-white"
          required
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-neonBlue hover:bg-white hover:text-black text-black font-bold px-4 py-2 rounded"
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default ContributePage;