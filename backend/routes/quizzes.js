const express = require('express');

const {
    submitQuiz
} = require('../controllers/quizController');

const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/:id/attempt', authenticateToken, submitQuiz);

module.exports = router;