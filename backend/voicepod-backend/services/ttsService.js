const fs = require('fs');
const util = require('util');
const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
const client = new TextToSpeechClient();

const textToSpeech = async (text) => {
    try {
        const [response] = await client.synthesizeSpeech({
            input: { text },
            voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
            audioConfig: { audioEncoding: 'MP3' },
        });
        const filename = `audio-${Date.now()}.mp3`;
        fs.writeFileSync(`public/${filename}`, response.audioContent, 'binary');
        return `http://localhost:5000/public/${filename}`;
    } catch (error) {
        console.error('Error in textToSpeech:', error);
        throw new Error('Failed to convert text to speech');
    }
}
module.exports = { textToSpeech };