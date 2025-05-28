const axios = require('axios');

async function getAdvice(dummy = '') {
    try {
        const response = await axios.get('https://api.adviceslip.com/advice');
        const advice = response.data.slip.advice;

        return `💡 Here's a piece of advice for you:\n"${advice}"`;
    } catch (error) {
        console.error('Error fetching advice:', error.message);
        throw new Error('Could not fetch advice at the moment.');
    }
}

module.exports = { getAdvice };
