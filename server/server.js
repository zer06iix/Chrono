// --- Imports ---
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/configs/db');

// --- Configs ---
const app = express()
dotenv.config();

// --- Middlewares ---
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ type: 'application/json', limit: '10mb' }));

// --- API routes ---
app.use('/api/v1', require('./src/v1/routes/index'));

const PORT = process.env.PORT;
app.listen(PORT ,() => {
    console.log(`Server is running on http://localhost:${PORT}`);

    connectDB();
});