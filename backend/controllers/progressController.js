const db = require("../config/db");

// Mark a lesson as completed
const completeLesson = async (req, res) => {
    try {
        const userId = req.user.id;
        const lessonId = req.params.id;

        // Check whether the lesson exists
        const [lessons] = await db.query(
            "SELECT id FROM lessons WHERE id = ?",
            [lessonId]
        );

        if (lessons.length === 0) {
            return res.status(404).json({
                message: "Lesson not found"
            });
        }

        // Insert progress or update existing progress
        await db.query(
            `INSERT INTO progress (user_id, lesson_id, completed, completed_at)
             VALUES (?, ?, TRUE, CURRENT_TIMESTAMP)
             ON DUPLICATE KEY UPDATE
             completed = TRUE,
             completed_at = CURRENT_TIMESTAMP`,
            [userId, lessonId]
        );

        res.status(200).json({
            message: "Lesson marked as completed"
        });

    } catch (error) {
        console.error("Error completing lesson:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

// Get the logged-in user's progress
const getProgress = async (req, res) => {
    try {
        const userId = req.user.id;

        const [progress] = await db.query(
            `SELECT
                progress.lesson_id,
                progress.completed,
                progress.completed_at,
                lessons.title AS lesson_title,
                courses.title AS course_title
             FROM progress
             JOIN lessons ON progress.lesson_id = lessons.id
             JOIN courses ON lessons.course_id = courses.id
             WHERE progress.user_id = ?
             ORDER BY courses.id, lessons.order_number`,
            [userId]
        );

        res.status(200).json(progress);

    } catch (error) {
        console.error("Error fetching progress:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    completeLesson,
	getProgress
};