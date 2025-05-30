const axios= require('axios');
const askGemini = async (text) => {
    try{
        const response = await axios.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
            prompt: text,
            model: 'gemini-1.5-flash',
            maxOutputTokens: 1024,
            temperature: 0.2,
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data.candidates[0].content;
    }catch (error) {
        console.error('Error in askGemini:', error);
        throw new Error('Failed to get response from Gemini API');
    }
}
module.exports = { askGemini };