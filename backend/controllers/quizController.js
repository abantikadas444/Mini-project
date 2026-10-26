const pool = require('../config/db');

const getQuizByLesson = async (req, res) => {
    try {
        const { id } = req.params;

        const [quizzes] = await pool.query(
            `SELECT id, lesson_id, title
             FROM quizzes
             WHERE lesson_id = ?`,
            [id]
        );

        if (quizzes.length === 0) {
            return res.status(404).json({
                message: 'Quiz not found.'
            });
        }

        const quiz = quizzes[0];

        const [questions] = await pool.query(
            `SELECT
                id,
                question,
                option_a,
                option_b,
                option_c,
                option_d,
                order_number
             FROM questions
             WHERE quiz_id = ?
             ORDER BY order_number`,
            [quiz.id]
        );

        res.json({
            id: quiz.id,
            lesson_id: quiz.lesson_id,
            title: quiz.title,
            questions
        });

    } catch (error) {
        console.error('Get quiz error:', error.message);

        res.status(500).json({
            message: 'Server error.'
        });
    }
};

const submitQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const { answers } = req.body;

        // Check that answers is a valid object
        if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
            return res.status(400).json({
                message: 'Answers are required.'
            });
        }

        // Get all questions belonging to this quiz
        const [questions] = await pool.query(
            `SELECT id, correct_answer
             FROM questions
             WHERE quiz_id = ?
             ORDER BY order_number`,
            [id]
        );

        if (questions.length === 0) {
            return res.status(404).json({
                message: 'Quiz not found.'
            });
        }

        // Find unanswered questions
        const unansweredQuestions = questions
            .filter(question => answers[question.id] === undefined)
            .map(question => question.id);

        if (unansweredQuestions.length > 0) {
            return res.status(400).json({
                message: 'Please answer the remaining questions.',
                unansweredQuestions
            });
        }

        // Check that every submitted question belongs to this quiz
        const questionIds = new Set(
            questions.map(question => question.id.toString())
        );

        for (const questionId of Object.keys(answers)) {
            if (!questionIds.has(questionId)) {
                return res.status(400).json({
                    message: `Question ${questionId} does not belong to this quiz.`
                });
            }
        }

        // Check that every answer is A, B, C, or D
        for (const questionId of Object.keys(answers)) {
            const answer = String(answers[questionId]).toUpperCase();

            if (!['A', 'B', 'C', 'D'].includes(answer)) {
                return res.status(400).json({
                    message: `Invalid answer for question ${questionId}.`
                });
            }
        }

        // Calculate score
        let score = 0;

        for (const question of questions) {
            const submittedAnswer = String(answers[question.id]).toUpperCase();

            if (submittedAnswer === question.correct_answer) {
                score++;
            }
        }

        const totalQuestions = questions.length;
        const percentage = (score / totalQuestions) * 100;

        // Save the completed attempt
        const [result] = await pool.query(
            `INSERT INTO quiz_attempts
                (user_id, quiz_id, score, total_questions)
             VALUES (?, ?, ?, ?)`,
            [req.user.id, id, score, totalQuestions]
        );

        let feedback;

        if (percentage === 100) {
            feedback = 'Excellent work!';
        } else if (percentage >= 80) {
            feedback = 'Great job!';
        } else if (percentage >= 60) {
            feedback = 'Good effort! Keep practicing.';
        } else {
            feedback = 'Keep practicing and review the lesson.';
        }

        res.status(201).json({
            message: 'Quiz submitted successfully.',
            attemptId: result.insertId,
            score,
            totalQuestions,
            percentage,
            feedback
        });

    } catch (error) {
        console.error('Submit quiz error:', error.message);

        res.status(500).json({
            message: 'Server error.'
        });
    }
};

module.exports = {
    getQuizByLesson,
	submitQuiz
};