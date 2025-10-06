import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import Papa from 'papaparse';

const ModerationDashboard = () => {
  const [contributions, setContributions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchContributions = async () => {
      const q = query(
        collection(db, 'sandbox_contributions'),
        where('approved', '==', false),
        orderBy('createdAt', sortOrder)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setContributions(data);
    };
    fetchContributions();
  }, [sortOrder]);

  const approveContribution = async (id) => {
    await updateDoc(doc(db, 'sandbox_contributions', id), { approved: true });
    setContributions(prev => prev.filter(item => item.id !== id));
  };

  const deleteContribution = async (id) => {
    await deleteDoc(doc(db, 'sandbox_contributions', id));
    setContributions(prev => prev.filter(item => item.id !== id));
  };

  const exportCSV = () => {
    const csvData = contributions.map(({ title, description, contributorEmail, createdAt }) => ({
      title,
      description,
      contributorEmail,
      createdAt: createdAt?.toDate().toLocaleString() || ''
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'unapproved_contributions.csv');
    link.click();
  };

  const filtered = contributions.filter(c =>
    c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="p-6 text-white max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-red-400 mb-4">Moderation Dashboard</h2>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search contributions..."
          className="w-full md:w-1/2 p-2 rounded bg-[#1a1c2e] text-white border border-gray-700"
        />

        <div className="flex gap-2">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="p-2 rounded bg-[#1a1c2e] text-white border border-gray-700"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>

          <button
            onClick={exportCSV}
            className="bg-neonBlue text-black px-4 py-2 rounded font-semibold hover:bg-white"
          >
            Export CSV
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-400">No unapproved contributions found.</p>
      ) : (
        <div className="space-y-4">
          {currentItems.map(c => (
            <div key={c.id} className="bg-[#1a1c2c] p-4 rounded border border-gray-700">
              <h3 className="text-lg font-bold text-neonPurple mb-2">{c.title || 'Untitled'}</h3>
              <p className="text-sm text-gray-300 mb-2 whitespace-pre-line">{c.description}</p>
              {c.fileURL && (
                c.fileURL.includes('.mp4') ? (
                  <video src={c.fileURL} controls className="rounded-lg max-w-xs mt-2" />
                ) : (
                  <img src={c.fileURL} alt="Preview" className="rounded-lg max-w-xs mt-2" />
                )
              )}
              <p className="text-xs text-gray-400 mt-2">By: {c.contributorEmail || 'Unknown'}</p>

              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => approveContribution(c.id)}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => deleteContribution(c.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {totalPages > 1 && (
            <div className="mt-6 flex justify-center space-x-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded border ${currentPage === i + 1 ? 'bg-neonPurple text-white' : 'border-gray-600 text-gray-400 hover:bg-gray-700'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ModerationDashboard;