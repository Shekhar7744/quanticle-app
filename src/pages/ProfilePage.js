import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import {
  collection, query, where, getDocs, deleteDoc, doc, addDoc, serverTimestamp, orderBy
} from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';
import ContributorEditModal from '../components/ContributorEditModal';
import ExplanationModal from '../components/ExplanationModal';
import toast, { Toaster } from 'react-hot-toast';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedContribution, setSelectedContribution] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [loadingId, setLoadingId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [commentsModalOpen, setCommentsModalOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentContributionId, setCommentContributionId] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    setUser(currentUser);
    if (currentUser) fetchContributions(currentUser.email);
  }, []);

  const fetchContributions = async (email) => {
    const q = query(collection(db, 'sandbox_contributions'), where('contributorEmail', '==', email));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setContributions(data);
  };

  const handleDelete = async (id, fileURL) => {
    const confirm = window.confirm('Are you sure you want to delete this contribution?');
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, 'sandbox_contributions', id));
      if (fileURL) {
        const decodedPath = decodeURIComponent(
          new URL(fileURL).pathname.replace(/^\/v0\/b\/[^/]+\/o\//, '').replace(/%2F/g, '/')
        );
        const fileRef = ref(storage, decodedPath);
        await deleteObject(fileRef);
      }
      toast.success('Deleted successfully!');
      fetchContributions(user.email);
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete contribution.');
    }
  };

  // AI explanation logic (disabled)
  const handleAskAI = async (contribution) => {
    toast.error('AI explanation is temporarily disabled.');
  };

  const openCommentsModal = async (contributionId) => {
    setCommentContributionId(contributionId);
    setCommentsModalOpen(true);
    await fetchComments(contributionId);
  };

  const fetchComments = async (contributionId) => {
    const q = query(
      collection(db, 'sandbox_contributions', contributionId, 'comments'),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setComments(data);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await addDoc(collection(db, 'sandbox_contributions', commentContributionId, 'comments'), {
        text: newComment,
        createdAt: serverTimestamp(),
        authorEmail: user.email,
      });
      setNewComment('');
      fetchComments(commentContributionId);
    } catch (err) {
      console.error('Failed to add comment:', err);
      toast.error('Failed to add comment');
    }
  };

  const paginatedContributions = contributions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(contributions.length / itemsPerPage);

  if (!user) return <div className="p-6 text-center text-white">Loading...</div>;

  return (
    <div className="p-6 text-white max-w-5xl mx-auto">
      <Toaster position="top-right" />
      <h2 className="text-3xl font-bold text-neonBlue mb-4">Your Profile</h2>

      <div className="bg-[#1a1c2e] rounded-lg p-4 shadow-md mb-8">
        <p><strong>Name:</strong> {user.displayName || 'N/A'}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      <h3 className="text-2xl font-semibold mb-3 text-neonPurple">Your Contributions</h3>
      {contributions.length === 0 ? (
        <p className="text-gray-400">You haven’t made any contributions yet.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {paginatedContributions.map(contribution => (
              <li key={contribution.id} className="bg-[#131426] p-4 rounded-md border border-gray-700">
                <h4 className="text-xl font-bold text-neonBlue mb-1">{contribution.title || 'Untitled'}</h4>
                <p className="text-sm text-gray-300 whitespace-pre-line">{contribution.description}</p>

                {contribution.fileURL && (
                  <div className="mt-2">
                    {contribution.fileURL.includes('.mp4') ? (
                      <video src={contribution.fileURL} controls className="w-full max-w-xs rounded" />
                    ) : (
                      <img src={contribution.fileURL} alt={contribution.title} className="mt-2 rounded-lg max-w-xs" />
                    )}
                  </div>
                )}

                <div className="text-sm mt-2 text-gray-400">
                  Status: {contribution.approved ? (
                    <span className="text-green-400">Approved</span>
                  ) : (
                    <span className="text-yellow-400">Pending</span>
                  )}
                </div>

                <div className="flex space-x-4 mt-3 flex-wrap">
                  <button
                    onClick={() => setSelectedContribution(contribution) || setEditModalOpen(true)}
                    className="text-neonBlue text-sm hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(contribution.id, contribution.fileURL)}
                    className="text-red-400 text-sm hover:underline"
                  >
                    Delete
                  </button>

                  {/* Ask AI button disabled */}
                  {false && (
                    <button
                      onClick={() => handleAskAI(contribution)}
                      className="text-sm bg-neonBlue px-2 py-1 rounded text-black hover:bg-white"
                      disabled={loadingId === contribution.id}
                    >
                      {loadingId === contribution.id ? 'Thinking...' : 'Ask AI'}
                    </button>
                  )}

                  <button
                    onClick={() => openCommentsModal(contribution.id)}
                    className="text-sm text-neonPurple hover:underline"
                  >
                    💬 Comments
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <div className="mt-6 flex justify-center space-x-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded border ${currentPage === i + 1
                    ? 'bg-neonPurple text-white'
                    : 'border-gray-600 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {selectedContribution && (
        <ContributorEditModal
          isOpen={editModalOpen}
          onClose={() => { setEditModalOpen(false); setSelectedContribution(null); }}
          contribution={selectedContribution}
          onUpdate={() => {
            fetchContributions(user.email);
            toast.success('Contribution updated!');
          }}
        />
      )}

      <ExplanationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        explanation={explanation}
      />

      {commentsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-[#1a1c2e] p-6 rounded-lg max-w-md w-full shadow-lg border border-neonBlue text-white relative">
            <button onClick={() => setCommentsModalOpen(false)}
              className="absolute top-2 right-3 text-gray-400 hover:text-red-400">✖</button>
            <h3 className="text-xl font-bold text-neonBlue mb-4">💬 Comments</h3>
            <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
              {comments.length === 0 ? (
                <p className="text-gray-400">No comments yet. Be the first!</p>
              ) : comments.map(comment => (
                <div key={comment.id} className="bg-[#131426] p-2 rounded">
                  <p className="text-sm text-gray-300">{comment.text}</p>
                  <p className="text-xs text-gray-500 mt-1">by {comment.authorEmail}</p>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 p-2 rounded bg-[#1a1c2e] text-white border border-gray-700"
              />
              <button
                onClick={handleAddComment}
                className="bg-neonBlue text-black px-3 py-1 rounded hover:bg-white font-bold"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;