const express = require('express');
const multer = require('multer');
const router = express.Router();
const {askGemini} =require('../services/geminiService');
const {textToSpeech}=require('../services/ttsService');

const upload=multer({dest:'uploads/'});
router.post('/ask',upload.single('audio'), async (req, res) => {
    try{
        const text= "transcribe your audio here, later use whisper";
        const response = await askGemini(text);
        const audioUrl = await textToSpeech(response);
        res.json({text: response,audioUrl});
    }catch(error) {
        console.error('Error in /ask route:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});
module.exports = router;
