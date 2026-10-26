const pool = require('../config/db');

const getAllCourses = async (req, res) => {
    try {
        const [courses] = await pool.query(
            `SELECT id, title, description, category, difficulty, created_at
             FROM courses
             ORDER BY id`
        );

        res.json(courses);

    } catch (error) {
        console.error('Get courses error:', error.message);

        res.status(500).json({
            message: 'Server error.'
        });
    }
};

const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;

        const [courses] = await pool.query(
            `SELECT id, title, description, category, difficulty, created_at
             FROM courses
             WHERE id = ?`,
            [id]
        );

        if (courses.length === 0) {
            return res.status(404).json({
                message: 'Course not found.'
            });
        }

        res.json(courses[0]);

    } catch (error) {
        console.error('Get course error:', error.message);

        res.status(500).json({
            message: 'Server error.'
        });
    }
};

const getLessonsByCourse = async (req, res) => {
    try {
        const { id } = req.params;

        const [lessons] = await pool.query(
            `SELECT id, course_id, title, content, order_number, created_at
             FROM lessons
             WHERE course_id = ?
             ORDER BY order_number`,
            [id]
        );

        res.json(lessons);

    } catch (error) {
        console.error('Get lessons error:', error.message);

        res.status(500).json({
            message: 'Server error.'
        });
    }
};

const getLessonById = async (req, res) => {
    try {
        const { id } = req.params;

        const [lessons] = await pool.query(
            `SELECT id, course_id, title, content, order_number, created_at
             FROM lessons
             WHERE id = ?`,
            [id]
        );

        if (lessons.length === 0) {
            return res.status(404).json({
                message: 'Lesson not found.'
            });
        }

        res.json(lessons[0]);

    } catch (error) {
        console.error('Get lesson error:', error.message);

        res.status(500).json({
            message: 'Server error.'
        });
    }
};

module.exports = {
    getAllCourses,
    getCourseById,
	getLessonsByCourse,
	getLessonById
};