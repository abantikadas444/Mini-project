const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
    completeLesson,
    getProgress
} = require("../controllers/progressController");

// Mark a lesson as completed
router.post(
    "/lessons/:id/complete",
    authMiddleware,
    completeLesson
);

// Get logged-in user's progress
router.get("/", authMiddleware, getProgress);

module.exports = router;