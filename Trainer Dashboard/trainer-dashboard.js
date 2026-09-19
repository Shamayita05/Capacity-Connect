// ================================
// CAPACITY CONNECT - TRAINER DASHBOARD
// ================================

// Change this value to the logged-in trainer's name.
// In a connected backend, this can be loaded from the user's profile/session.
const trainerName = "Trainer";

document.addEventListener("DOMContentLoaded", () => {
    const nameElement = document.getElementById("trainerName");

    if (nameElement) {
        nameElement.textContent = trainerName;
    }

    // Prevent accidental navigation for placeholder pages that do not exist yet.
    // Remove this block if all target pages are already connected to your project.
    const cards = document.querySelectorAll(".dashboard-card");

    cards.forEach((card) => {
        card.addEventListener("click", () => {
            card.classList.add("card-clicked");
        });
    });
});