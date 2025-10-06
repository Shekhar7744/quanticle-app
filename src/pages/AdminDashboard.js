import React, { useEffect, useState } from 'react';
import { collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import toast, { Toaster } from 'react-hot-toast';

const AdminDashboard = () => {
  const [contributions, setContributions] = useState([]);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'sandbox_contributions'));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setContributions(data);
      } catch (err) {
        console.error('Failed to fetch:', err);
        toast.error('Error fetching contributions');
      }
    };
    fetchData();
  }, []);

  const handleApprove = async (id) => {
    try {
      await updateDoc(doc(db, 'sandbox_contributions', id), { approved: true });
      setContributions(prev => prev.map(c => c.id === id ? { ...c, approved: true } : c));
      toast.success('Approved successfully!');
    } catch (err) {
      console.error('Approve error:', err);
      toast.error('Failed to approve.');
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure?');
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, 'sandbox_contributions', id));
      setContributions(prev => prev.filter(c => c.id !== id));
      toast.success('Deleted successfully!');
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete.');
    }
  };

  const exportCSV = () => {
    try {
      const headers = ['ID', 'Email', 'Description', 'Approved'];
      const rows = filtered.map(c => [
        c.id,
        c.contributorEmail,
        c.description?.replace(/\n/g, ' ') || '',
        c.approved
      ]);
      const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'contributions.csv');
      link.click();
      toast.success('CSV exported!');
    } catch (err) {
      toast.error('Failed to export CSV');
    }
  };

  const filtered = contributions
    .filter(c => c.description?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortOrder === 'newest'
      ? b.createdAt?.seconds - a.createdAt?.seconds
      : a.createdAt?.seconds - b.createdAt?.seconds
    );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="p-6 text-white max-w-5xl mx-auto">
      <Toaster position="top-right" />
      <h2 className="text-3xl font-bold mb-6 text-neonBlue">Admin Dashboard</h2>

      <div className="mb-4 flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search description..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-[#1a1c2e] px-3 py-2 rounded text-white border border-gray-600"
        />
        <select
          value={sortOrder}
          onChange={e => setSortOrder(e.target.value)}
          className="bg-[#1a1c2e] px-3 py-2 rounded text-white border border-gray-600"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
        <button
          onClick={exportCSV}
          className="bg-neonBlue text-black px-4 py-2 rounded font-bold hover:bg-white"
        >
          Export CSV
        </button>
      </div>

      <ul className="space-y-4">
        {paginated.map(c => (
          <li key={c.id} className="bg-[#131426] p-4 rounded-md border border-gray-700">
            <div className="flex justify-between">
              <div>
                <p className="text-sm mb-1 text-gray-300 whitespace-pre-line">{c.description}</p>
                <p className="text-xs text-gray-500">Email: {c.contributorEmail}</p>
                <p className={`text-xs font-semibold ${c.approved ? 'text-green-400' : 'text-yellow-400'}`}>
                  {c.approved ? 'Approved' : 'Pending Review'}
                </p>
              </div>
              <div className="space-y-2 text-right">
                {!c.approved && (
                  <button
                    onClick={() => handleApprove(c.id)}
                    className="text-green-400 hover:underline"
                  >
                    ✅ Approve
                  </button>
                )}
                <button
                  onClick={() => handleDelete(c.id)}
                  className="text-red-400 hover:underline"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={() => setCurrentPage(p => p - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-white">Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage(p => p + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;