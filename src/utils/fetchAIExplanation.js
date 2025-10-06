import axios from 'axios';

export const fetchAIExplanation = async ({ title, description }) => {
  try {
    const response = await axios.post(
      'https://us-central1-quanticle-51638.cloudfunctions.net/simulationExplain',
      { title, description },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data.explanation;
  } catch (error) {
    console.error('🔥 AI fetch error:', error);
    throw new Error('Failed to get explanation');
  }
};