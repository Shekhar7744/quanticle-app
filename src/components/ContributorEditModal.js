import React, { useState } from 'react';
import { updateDoc, doc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import toast from 'react-hot-toast';

const ContributorEditModal = ({ isOpen, onClose, contribution, onUpdate }) => {
  const [title, setTitle] = useState(contribution.title || '');
  const [description, setDescription] = useState(contribution.description || '');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    try {
      setUploading(true);
      let fileURL = contribution.fileURL;

      if (file) {
        const fileRef = ref(storage, `sandbox_files/${contribution.id}/${file.name}`);
        await uploadBytes(fileRef, file);
        fileURL = await getDownloadURL(fileRef);
      }

      const docRef = doc(db, 'sandbox_contributions', contribution.id);
      await updateDoc(docRef, {
        title,
        description,
        fileURL,
        approved: false, // reset approval on edit
        updatedAt: new Date()
      });

      toast.success('Contribution updated successfully!');
      onUpdate(); // Refresh the list
      onClose();
    } catch (err) {
      console.error('Update error:', err);
      toast.error('Failed to update contribution.');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
      <div className="bg-[#1a1c2e] p-6 rounded-md shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4 text-neonBlue">Edit Contribution</h2>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-3 rounded bg-[#2c2f48] border border-gray-600 text-white"
          placeholder="Title"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full p-2 mb-3 rounded bg-[#2c2f48] border border-gray-600 text-white"
          placeholder="Description"
        />

        <div className="mb-3">
          <p className="text-sm text-gray-300 mb-1">Replace file (optional):</p>
          <input type="file" onChange={handleFileChange} className="text-white" />
        </div>

        {contribution.fileURL && (
          <div className="mb-3">
            <p className="text-xs text-gray-400">Current file:</p>
            <a href={contribution.fileURL} target="_blank" rel="noopener noreferrer" className="text-neonPurple underline text-sm">
              View current file
            </a>
          </div>
        )}

        <div className="flex justify-end space-x-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">Cancel</button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-neonPurple text-white rounded hover:bg-purple-700"
            disabled={uploading}
          >
            {uploading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContributorEditModal;