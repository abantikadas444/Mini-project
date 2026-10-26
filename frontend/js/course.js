const API_BASE_URL = "http://26.111.109.136:3000";

const params = new URLSearchParams(window.location.search);
const courseId = params.get("id");

const courseTitle = document.getElementById("course-title");
const courseDescription = document.getElementById("course-description");
const lessonContainer = document.getElementById("lesson-container");

async function loadCourse() {
    if (!courseId) {
        courseTitle.textContent = "Course not found";
        lessonContainer.innerHTML = "<p>No course ID was provided.</p>";
        return;
    }

    try {
        // Get course information
        const courseResponse = await fetch(
            `${API_BASE_URL}/api/courses/${courseId}`
        );

        if (!courseResponse.ok) {
            throw new Error("Failed to load course.");
        }

        const course = await courseResponse.json();

        courseTitle.textContent = course.title;
        courseDescription.textContent = course.description;

        // Get lessons for this course
        const lessonsResponse = await fetch(
            `${API_BASE_URL}/api/courses/${courseId}/lessons`
        );

        if (!lessonsResponse.ok) {
            throw new Error("Failed to load lessons.");
        }

        const lessons = await lessonsResponse.json();

        lessonContainer.innerHTML = "";

        if (lessons.length === 0) {
            lessonContainer.innerHTML = "<p>No lessons available.</p>";
            return;
        }

        lessons.forEach(lesson => {
            const lessonCard = document.createElement("div");
            lessonCard.classList.add("feature-card");

            lessonCard.innerHTML = `
                <h3>Lesson ${lesson.order_number}: ${lesson.title}</h3>

                <p>${lesson.content}</p>

                <br>

                <a href="lesson.html?id=${lesson.id}" class="btn">
                    Read Lesson
                </a>
            `;

            lessonContainer.appendChild(lessonCard);
        });

    } catch (error) {
        console.error("Error loading course:", error);

        lessonContainer.innerHTML = `
            <p>
                Unable to load the course. Please make sure the backend server is running.
            </p>
        `;
    }
}

loadCourse();