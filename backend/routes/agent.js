//  /routes/agent.js
const express = require('express');
const router = express.Router();

const { callGemini } = require('../lib/geminiClient');
const { routeTool } = require('../lib/toolRouter');

router.post('/agent', async (req, res) => {
    const { prompt } = req.body;

    const systemMessage = `
You have access to these tools:

1. Email – Draft and send professional emails.
   Requires: 
   - input (email content instruction)
   - receiverMail (email address)

2. Weather – Provide forecasts.
   Requires: 
   - input (brief request)
   - city (e.g., "Delhi", "New York")

3. News – Fetch latest headlines.
   Requires: 
   - input (brief request)
   - topic (e.g., "technology", "sports")

4. Advice – Provide helpful suggestions.
   Requires:
   - input (context or user mood)
   - type (e.g., "mental health", "productivity")

Respond ONLY in this JSON format:

{
  "tool": "ToolName",
  "input": "main input string",
  "meta": {
    "receiverMail" / "city" / "topic" / "type": "value"
  }
}

If a required field is missing, respond with:

{
  "error": "Missing required field: fieldName"
}

No extra text. No explanation. Just JSON.
`;

    if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid "prompt" in request body' });
    }
    try {
        const geminiResponse = await callGemini(
            `${systemMessage}\nUser request: ${prompt}`,
            { temperature: 0 }
        );
        console.log('Received prompt:', geminiResponse);

        let parsed;
        try {
            parsed = JSON.parse(geminiResponse);
        } catch (e) {
            console.error('Failed to parse Gemini response:', geminiResponse);
            throw new Error('Invalid response format from Gemini API');
        }

        if (parsed.error) {
            return res.status(400).json({ error: parsed.error });
        }

        const { tool, input, meta } = parsed;

        if (!tool || !input || typeof meta !== 'object') {
            throw new Error('Response missing tool, input, or meta fields');
        }

        const output = await routeTool(tool, input, meta);

        return res.status(200).json({ result: output });
    } catch (error) {
        console.error('Agent error:', error);
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});
module.exports = router;
