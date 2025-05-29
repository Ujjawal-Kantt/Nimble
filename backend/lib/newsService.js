const axios = require('axios');
require('dotenv').config();

async function getNews(topic = 'general') {
    try {
        const apiKey = process.env.NEWS_API_KEY;
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(topic)}&apiKey=${apiKey}&pageSize=5&language=en&sortBy=publishedAt`;

        const response = await axios.get(url);
        const articles = response.data.articles;

        if (!articles.length) {
            return `No news articles found for "${topic}". Try a different topic.`;
        }

        const newsList = articles.map((article, idx) => {
            return `${idx + 1}. **${article.title}**\n${article.description}\n🔗 [Read more](${article.url})\n`;
        }).join('\n');

        return { type: "news", topic: topic, news: newsList };
    } catch (error) {
        console.error('Error fetching news:', error.message);
        throw new Error('Could not fetch news. Try again later.');
    }
}

module.exports = { getNews };
