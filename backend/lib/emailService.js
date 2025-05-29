const nodemailer = require('nodemailer');
const { callGemini } = require('../lib/geminiClient');

require('dotenv').config();

async function draftEmail(prompt, receiverMail) {
    try {
        // Step 1: Ask Gemini to generate the email content
        const geminiPrompt = `
You are an AI email writer. Given a prompt, generate a formal, concise email in HTML format.
Rules:
- Do NOT invent or assume missing data.
- If specific fields (e.g., position name or date) are not included in the prompt, do NOT mention them in the email.
- Format should be polite, professional, and HTML-safe.
-Don't write html in the first line.
Prompt:
"${prompt}"
`;

        const emailHtml = await callGemini(geminiPrompt);

        // Step 2: Define mail configuration
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        console.log("emailHtml", emailHtml);
        const mailOptions = {
            from: process.env.EMAIL,
            to: receiverMail,
            subject: 'Generated Email by Nimble Agent',
            html: emailHtml,
        };

        // Step 3: Send the email
        await transporter.sendMail(mailOptions);
        const successMessage = `Hurray! Your Email is drafted and sent successfully to ${receiverMail}.`;
        return {
            type: "email",
            message: successMessage
        };
    } catch (error) {
        console.error('Error in draftEmail:', error);
        throw new Error('Failed to draft and send the email');
    }
}

module.exports = { draftEmail };
