const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINIKEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function callGemini(prompt) {
    try {
        const result = await model.generateContent(prompt);
        let rawOutput = result.response.text();

        // Clean unwanted formatting (e.g., ```json blocks)
        rawOutput = rawOutput.replace(/```json\n?|```/g, "").trim();

        return rawOutput;
    } catch (error) {
        console.error("Gemini API call failed:", error);
        throw new Error("Gemini API request failed");
    }
}

module.exports = { callGemini };
