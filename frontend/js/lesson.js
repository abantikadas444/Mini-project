const API_BASE_URL = "http://26.111.109.136:3000";

const params = new URLSearchParams(window.location.search);
const lessonId = params.get("id");

const lessonTitle = document.getElementById("lesson-title");
const lessonContent = document.getElementById("lesson-content");

async function loadLesson() {
    if (!lessonId) {
        lessonTitle.textContent = "Lesson not found";
        lessonContent.textContent = "No lesson ID was provided.";
        return;
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}/api/lessons/${lessonId}`
        );

        if (!response.ok) {
            throw new Error("Failed to load lesson.");
        }

        const lesson = await response.json();

        lessonTitle.textContent = lesson.title;
        lessonContent.textContent = lesson.content;

    } catch (error) {
        console.error("Error loading lesson:", error);

        lessonTitle.textContent = "Unable to load lesson";
        lessonContent.textContent =
            "Please make sure the backend server is running.";
    }
}

loadLesson();