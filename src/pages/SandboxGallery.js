import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import toast, { Toaster } from 'react-hot-toast';
import ExplanationModal from '../components/ExplanationModal';

const GalleryPage = () => {
  const [simulations, setSimulations] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [loadingId, setLoadingId] = useState(null);

  // Comments
  const [commentsModalOpen, setCommentsModalOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentSimId, setCommentSimId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, 'sandbox_contributions'), where('approved', '==', true), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSimulations(data);
    };
    fetchData();
  }, []);

  const handleAskAI = async (sim) => {
    setLoadingId(sim.id);
    setExplanation('');
    setModalOpen(true);
    toast.loading('Generating AI explanation...');

    try {
      const res = await fetch('https://us-central1-quanticle-51638.cloudfunctions.net/simulationExplain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Explain this simulation titled "${sim.title}": ${sim.description}`
        }),
      });

      const data = await res.json();
      if (data?.explanation) {
        setExplanation(data.explanation);
        toast.dismiss();
        toast.success('Explanation ready!');
      } else {
        throw new Error('No explanation received');
      }
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to get explanation');
      setModalOpen(false);
    } finally {
      setLoadingId(null);
    }
  };

  // Comments
  const openCommentsModal = async (simId) => {
    setCommentSimId(simId);
    setCommentsModalOpen(true);
    await fetchComments(simId);
  };

  const fetchComments = async (simId) => {
    const snapshot = await getDocs(query(
      collection(db, 'sandbox_contributions', simId, 'comments'),
      orderBy('createdAt', 'desc')
    ));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setComments(data);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await addDoc(collection(db, 'sandbox_contributions', commentSimId, 'comments'), {
        text: newComment,
        createdAt: serverTimestamp(),
        authorEmail: "anonymous"
      });
      setNewComment('');
      fetchComments(commentSimId);
    } catch (err) {
      console.error('Add comment failed', err);
      toast.error('Failed to add comment');
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto text-white">
      <Toaster position="top-right" />
      <h2 className="text-3xl font-bold mb-6 text-neonBlue">🧪 Sandbox Gallery</h2>

      <div className="space-y-6">
        {simulations.map((sim) => (
          <div key={sim.id} className="bg-[#1a1c2e] p-4 rounded-lg shadow border border-gray-700">
            <h3 className="text-xl font-semibold text-neonPurple">{sim.title}</h3>
            <p className="text-gray-300 text-sm mt-1 whitespace-pre-line">{sim.description}</p>

            {sim.fileURL && (
              <div className="mt-3">
                {sim.fileURL.includes('.mp4') ? (
                  <video src={sim.fileURL} controls className="w-full max-w-md rounded" />
                ) : (
                  <img src={sim.fileURL} alt={sim.title} className="w-full max-w-md rounded" />
                )}
              </div>
            )}

            <div className="flex space-x-4 mt-3 flex-wrap">
              {/* Ask AI temporarily disabled */}
              {false && (
                <button
                  onClick={() => handleAskAI(sim)}
                  className="bg-neonBlue text-black font-bold px-4 py-2 rounded hover:bg-white"
                  disabled={loadingId === sim.id}
                >
                  {loadingId === sim.id ? 'Thinking...' : 'Ask AI'}
                </button>
              )}

              <button
                onClick={() => openCommentsModal(sim.id)}
                className="text-sm text-neonPurple hover:underline"
              >
                💬 Comments
              </button>
            </div>
          </div>
        ))}
      </div>

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

export default GalleryPage;