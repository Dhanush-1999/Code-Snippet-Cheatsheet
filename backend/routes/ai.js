const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/explain', auth, async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ msg: 'Code snippet is required in the request body' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Explain the following code snippet in simple terms, as if you were explaining it to a fellow student. Don't just explain what each line does, but what the code achieves as a whole:\n\n\`\`\`\n${code}\n\`\`\``;

    const result = await model.generateContentStream(prompt);

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Transfer-Encoding', 'chunked');

    for await (const chunk of result.stream) {
      res.write(chunk.text());
    }
    
    res.end();

  } catch (error) {
    console.error('Error with Gemini API:', error);
    res.status(500).send('Error communicating with AI service');
  }
});

module.exports = router;