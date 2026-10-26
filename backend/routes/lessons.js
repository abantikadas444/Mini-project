const express = require('express');

const {
    getLessonById
} = require('../controllers/courseController');

const {
    getQuizByLesson
} = require('../controllers/quizController');

const router = express.Router();

router.get('/:id/quiz', getQuizByLesson);
router.get('/:id', getLessonById);

module.exports = router;