// /lib/toolRouter.js

const { draftEmail } = require('./emailService');
const { getWeather } = require('./weatherService');
const { getNews } = require('./newsService');
const { getAdvice } = require('./adviceService');

async function routeTool(tool, input, meta) {
    switch (tool) {
        case 'Email':
            return await draftEmail(input, meta.receiverMail);
        case 'Weather':
            console.log(`Fetching weather for city: ${meta.city}`);
            return await getWeather(meta.city);
        case 'News':
            return await getNews(meta.topic);
        case 'Advice':
            return await getAdvice(input, meta.type);
        default:
            throw new Error(`Unknown tool: ${tool}`);
    }
}

module.exports = { routeTool };
