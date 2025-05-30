const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const airoutes = require('./routes/ai');
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/ai', airoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});