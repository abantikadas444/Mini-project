const cors = require('cors');
const express = require('express');
const pool = require('./config/db');
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses'); 
const lessonRoutes = require('./routes/lessons');
const quizRoutes = require('./routes/quizzes');
const progressRoutes = require("./routes/progress");

const app = express();

app.use(cors({
    origin: [
        'http://127.0.0.1:5500',
        'http://localhost:5500'
    ]
}));

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/quizzes', quizRoutes);
app.use("/api/progress", progressRoutes);

const PORT = 3000;

app.get('/', (req, res) => {
    res.json({
        message: 'Interactive Learning Platform API is running!'
    });
});

app.get('/api/test-db', async (req, res) => {	
    try {
        const [rows] = await pool.query('SELECT 1 AS result');

        res.json({
            message: 'Database connection successful!',
            result: rows[0].result
        });
    } catch (error) {
        console.error('Database connection failed:', error.message);

        res.status(500).json({
            message: 'Database connection failed'
        });
    }
});

app.listen(PORT,'0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});