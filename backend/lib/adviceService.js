const { callGemini } = require('./geminiClient');

async function getAdvice(topic = '') {
    if (!topic || typeof topic !== 'string') {
        throw new Error('Invalid or missing topic for advice.');
    }

    // Craft a prompt that instructs Gemini to generate advice on the topic
    const prompt = `
You are an insightful advisor. Provide a short, practical piece of advice on the following topic:

"${topic}"

Keep the advice clear and helpful. Return ONLY the advice text, no extra explanation.
`;

    try {
        const advice = await callGemini(prompt);

        // Clean up the response if needed (remove quotes, markdown, etc.)
        const cleanAdvice = advice.trim().replace(/^["']|["']$/g, '');
        const ans = {
            topic: topic,
            advice: cleanAdvice
        }
        return { type: "advice", ans };
    } catch (error) {
        console.error('Error generating advice from Gemini:', error.message);
        throw new Error('Could not generate advice at the moment.');
    }
}

module.exports = { getAdvice };
