const express = require('express');

const {
    getAllCourses,
    getCourseById,
	getLessonsByCourse,
	getLessonsbyId
} = require('../controllers/courseController');

const router = express.Router();

router.get('/', getAllCourses);
router.get('/:id/lessons', getLessonsByCourse);
router.get('/:id', getCourseById);

module.exports = router;