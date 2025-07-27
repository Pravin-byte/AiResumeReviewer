require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs/promises'); // use promise-based fs
const axios = require('axios');

const app = express();
const port = process.env.PORT || 5001;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

// === Helper to call OpenRouter ===
async function callOpenRouter(prompt, model = 'openai/gpt-4o', max_tokens = 500, systemMessage = 'You are a helpful assistant.') {
  try {
    const response = await axios.post(
      `${process.env.OPENAI_API_BASE}/chat/completions`,
      {
        model,
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPEN_AI_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.REFERER_URL || 'http://localhost:5173',
          'X-Title': process.env.APP_TITLE || 'AI Resume Reviewer'
        }
      }
    );

    const content = response.data?.choices?.[0]?.message?.content;
    return content;
  } catch (err) {
    console.error('OpenRouter API error:', err?.response?.data || err.message);
    throw new Error('OpenRouter API call failed.');
  }
}

// === PDF Upload + Extraction ===
app.post('/api/upload-pdf', upload.single('resume'), async (req, res) => {
  try {
    const dataBuffer = await fs.readFile(req.file.path);
    const pdfData = await pdfParse(dataBuffer);
    await fs.unlink(req.file.path); // clean up
    res.json({ extractedText: pdfData.text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to extract PDF content.' });
  }
});
app.post('/api/review', async (req, res) => {
  const { resume, role } = req.body;
  if (!resume || !role) {
    return res.status(400).json({ error: 'Resume and role are required.' });
  }

  const prompt = `You are a professional resume reviewer. Respond strictly in JSON with this format:
  {
    "strengths": ["...", "...", "..."],
    "weaknesses": ["...", "...", "..."],
    "missing_keywords": "keyword1, keyword2, keyword3"
  }

  Given the following resume and role, analyze:

  Resume:
  """
  ${resume}
  """
  Role: ${role}`;


  try {
    console.log("Calling OpenRouter...");
    const content = await callOpenRouter(prompt, 'openai/gpt-4o', 500);
    console.log("OpenRouter response:", content);

    if (!content) {
      return res.status(500).json({ error: 'No response received from OpenRouter API.' });
    }

    try {
      // Remove Markdown-style ```json ... ``` if present
      const cleanedContent = content.trim().replace(/^```json\n?/, '').replace(/```$/, '');

      const feedback = JSON.parse(cleanedContent);
      console.log(feedback);
      res.json(feedback);
    } catch (e) {
      console.error("JSON parse error:", e.message);
      res.json({ raw: content, warning: 'Could not parse response as JSON.' });
    }


  } catch (err) {
    console.error("API call failed:", err);
    res.status(500).json({ error: err.message });
  }
});

// === Resume Rewrite Route ===
app.post('/api/generate-resume', async (req, res) => {
  const { resume, role } = req.body;
  if (!resume || !role) {
    return res.status(400).json({ error: 'Resume and role are required.' });
  }

  const prompt = `You are an expert resume writer specializing in ATS-optimized resumes.

    Given the original resume content and the target job role, rewrite the resume to better match the job description. Your goal is to:
    - Align the resume with the target role’s requirements
    - Highlight relevant experience and achievements
    - Include industry-relevant keywords and skills
    - Keep it concise, professional, and ATS-friendly (avoid fancy formatting)
    - Use a clean plain-text format with clear headings (e.g., Summary, Skills, Experience, Education)

    Use bullet points where applicable.

    Resume:
    """
    ${resume}
    """

    Target Role:
    """
    ${role}
    """

    Output: The improved resume only, in plain text format. Do not include any commentary or explanation.`;


  try {
    const content = await callOpenRouter(prompt, 'openai/gpt-4o', 1000, 'You are a professional resume writer.');
    res.json({ improvedResume: content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// === Start Server ===
app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
