# AI Resume Reviewer Backend

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the `backend` directory with your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. Start the server:
   ```bash
   node index.js
   ```

The server will run on port 5000 by default.

## Endpoint

### POST /api/review
- **Body:**
  ```json
  {
    "resume": "<resume text>",
    "role": "<target job role>"
  }
  ```
- **Response:**
  ```json
  {
    "strengths": ["..."],
    "weaknesses": ["..."],
    "missing_keywords": ["..."]
  }
  ``` 