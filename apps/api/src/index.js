const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const prisma = require('./config/db');
const authRoutes = require('./routes/auth');
const pitchRoutes = require('./routes/pitches');

const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/pitches', pitchRoutes);

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'FoundersDock API is running!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

//Test database connections
async function testDataBaseConnection() {
    try {
        await prisma.$connect();
        console.log('Database connected successfully');
    }
    catch (error) {
        console.error('Database connection failed: ', error);
    }
}
testDataBaseConnection();