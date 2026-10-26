const API_BASE_URL = "http://26.111.109.136:3000";

const courseContainer = document.getElementById("course-container");

async function loadCourses() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/courses`);

        if (!response.ok) {
            throw new Error("Failed to load courses.");
        }

        const courses = await response.json();

        courseContainer.innerHTML = "";

        courses.forEach(course => {
            const courseCard = document.createElement("div");
            courseCard.classList.add("feature-card");

            courseCard.innerHTML = `
                <h3>${course.title}</h3>

                <p>
                    ${course.description}
                </p>

                <br>

                <a href="course.html?id=${course.id}" class="btn">
                    Start Course
                </a>
            `;

            courseContainer.appendChild(courseCard);
        });

    } catch (error) {
        console.error("Error loading courses:", error);

        courseContainer.innerHTML = `
            <p>
                Unable to load courses. Please make sure the backend server is running.
            </p>
        `;
    }
}

loadCourses();