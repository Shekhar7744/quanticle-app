const { onRequest } = require("firebase-functions/v2/https");

exports.simulationExplain = onRequest(async (req, res) => {
  try {
    const prompt = req.body.prompt;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required." });
    }

    // 🔁 Mocked response instead of calling OpenAI API
    const explanation = `🧪 This is a MOCKED explanation of your simulation prompt: "${prompt}".`;

    return res.status(200).json({ explanation });
  } catch (error) {
    console.error("🔥 Error in simulationExplain function:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});