import React, { useState } from 'react';
import { motion } from 'framer-motion';

const LikeButton = () => {
  const [liked, setLiked] = useState(false);

  return (
    <motion.button
      onClick={() => setLiked(!liked)}
      whileTap={{ scale: 1.3 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className={`px-3 py-1 rounded-full font-bold text-sm ${
        liked ? 'bg-pink-500 text-white' : 'bg-gray-700 text-gray-300'
      }`}
    >
      ❤️ {liked ? 'Liked' : 'Like'}
    </motion.button>
  );
};

export default LikeButton;