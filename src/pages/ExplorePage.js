import React, { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import toast, { Toaster } from 'react-hot-toast';
import ExplanationModal from '../components/ExplanationModal';
import { useNavigate } from 'react-router-dom';

const ExplorePage = () => {
  const [contributions, setContributions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [loadingId, setLoadingId] = useState(null);

  // Comments
  const [commentsModalOpen, setCommentsModalOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentContributionId, setCommentContributionId] = useState(null);

  // Interactive config modal
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [shape, setShape] = useState('box');
  const [mass, setMass] = useState(1);
  const [useGravity, setUseGravity] = useState(true);
  const [color, setColor] = useState('#7b61ff');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const q = query(
        collection(db, 'sandbox_contributions'),
        where('approved', '==', true),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setContributions(data);
    };
    fetchData();
  }, []);

  const handleAskAI = /* your existing AskAI code  */ async (contribution) => {
    // unchanged
  };

  // Comments (unchanged)
  const openCommentsModal = async (contributionId) => {
    setCommentContributionId(contributionId);
    setCommentsModalOpen(true);
    const snap = await getDocs(
      query(collection(db, 'sandbox_contributions', contributionId, 'comments'), orderBy('createdAt', 'desc'))
    );
    setComments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    await addDoc(
      collection(db, 'sandbox_contributions', commentContributionId, 'comments'),
      {
        text: newComment,
        createdAt: serverTimestamp(),
        authorEmail: 'anonymous'
      }
    );
    setNewComment('');
    openCommentsModal(commentContributionId);
  };

  // ====== Interactive Simulation ======
  const openConfigModal = (id) => {
    setSelectedId(id);
    setConfigModalOpen(true);
  };

  const saveConfig = async () => {
    await setDoc(doc(db, 'sandbox_contributions', selectedId, 'config', 'settings'), {
      shape,
      mass: Number(mass),
      gravity: useGravity,
      color
    });
    toast.success('Simulation config saved!');
    setConfigModalOpen(false);
  };

  const runSimulation = (id) => {
    navigate(`/play/${id}`);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto text-white">
      <Toaster position="top-right" />
      <h2 className="text-3xl font-bold mb-6 text-neonBlue">🔍 Explore Simulations</h2>

      <div className="space-y-6">
        {contributions.map((c) => (
          <div key={c.id} className="bg-[#1a1c2e] p-4 rounded-lg shadow border border-gray-700">
            <h3 className="text-xl font-semibold text-neonPurple">{c.title}</h3>
            <p className="text-gray-300 text-sm mt-1 whitespace-pre-line">{c.description}</p>

            {c.fileURL && (
              <div className="mt-3">
                {c.fileURL.includes('.mp4')
                  ? <video src={c.fileURL} controls className="w-full max-w-md rounded" />
                  : <img src={c.fileURL} alt={c.title} className="w-full max-w-md rounded" />
                }
              </div>
            )}

            <div className="flex space-x-4 mt-3 flex-wrap">
              {/* Ask AI (still here but optional) */}
              <button
                onClick={() => handleAskAI(c)}
                className="bg-neonBlue text-black font-bold px-4 py-2 rounded hover:bg-white"
                disabled={loadingId === c.id}>
                {loadingId === c.id ? 'Thinking…' : 'Ask AI'}
              </button>

              {/* Comments */}
              <button
                onClick={() => openCommentsModal(c.id)}
                className="text-sm text-neonPurple hover:underline">
                💬 Comments
              </button>

              {/* Convert to interactive */}
              <button
                onClick={() => openConfigModal(c.id)}
                className="text-sm text-neonBlue hover:underline">
                ⚙️ Convert to Interactive
              </button>

              {/* Run interactive if config exists */}
              <button
                onClick={() => runSimulation(c.id)}
                className="text-sm text-green-400 hover:underline">
                ▶️ Run Simulation
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Config Modal */}
      {configModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#1a1c2e] p-6 rounded-md border border-neonBlue w-full max-w-sm">
            <h3 className="text-lg text-neonBlue mb-3">Configure Simulation</h3>

            <label className="text-sm">Shape</label>
            <select value={shape} onChange={e => setShape(e.target.value)}
              className="w-full p-2 bg-[#131426] mb-2 rounded border border-gray-600 text-white">
              <option value="box">Box</option>
              <option value="sphere">Sphere</option>
            </select>

            <label className="text-sm">Mass</label>
            <input
              type="number"
              value={mass}
              onChange={e => setMass(e.target.value)}
              className="w-full p-2 bg-[#131426] mb-2 rounded border border-gray-600 text-white"
            />

            <label className="text-sm">
              <input
                type="checkbox"
                checked={useGravity}
                onChange={e => setUseGravity(e.target.checked)}
                className="mr-2"
              />
              Use Gravity
            </label>

            <label className="text-sm mt-2 block">Color</label>
            <input
              type="color"
              value={color}
              onChange={e => setColor(e.target.value)}
              className="w-full h-8 mb-4 cursor-pointer"
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setConfigModalOpen(false)}
                className="text-sm px-3 py-1 bg-gray-700 rounded">
                Cancel
              </button>
              <button
                onClick={saveConfig}
                className="text-sm px-3 py-1 bg-neonBlue text-black rounded font-bold">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <ExplanationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        explanation={explanation}
      />

      {/* Comments modal unchanged */}
      {commentsModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          {/* your existing comments modal code here */}
        </div>
      )}
    </div>
  );
};

export default ExplorePage;