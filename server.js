// ═══════════════════════════════════════════════════════════
// 🔌 IMPORTS: Load required packages
// ═══════════════════════════════════════════════════════════
import express from 'express';        // Web server framework
import OpenAI from 'openai';          // ChatGPT API
import cors from 'cors';              // Allow frontend to talk to backend
import dotenv from 'dotenv';          // Load .env file

dotenv.config();                      // Read .env file

// ═══════════════════════════════════════════════════════════
// ⚙️ SETUP: Initialize server and AI
// ═══════════════════════════════════════════════════════════
const app = express();
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY  // Get API key from .env
});

app.use(cors());                      // Enable CORS
app.use(express.json());              // Parse JSON requests

// ═══════════════════════════════════════════════════════════
// 🤖 API ROUTE: /api/dance-advice
// ═══════════════════════════════════════════════════════════
app.post('/api/dance-advice', async (req, res) => {
  try {
    const { prompt } = req.body;      // Get prompt name from frontend
    
    // Ask ChatGPT for advice
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional dance instructor specializing in freestyle dance."
        },
        {
          role: "user",
          content: `Give me specific advice for practicing "${prompt}" in freestyle dance. Keep it under 100 words.`
        }
      ],
      max_tokens: 150
    });

    // Send AI's response back to frontend
    res.json({ advice: completion.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI Error:', error);
    res.status(500).json({ error: error.message || 'Failed to get AI advice' });
  }
});

// ═══════════════════════════════════════════════════════════
// 🚀 START SERVER: Listen on port 3001
// ═══════════════════════════════════════════════════════════
const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));