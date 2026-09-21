// ============================================
// CAPACITY CONNECT - TRAINER DASHBOARD
// ============================================

const STORAGE_KEY = "capacityConnectTrainerProfile";

document.addEventListener("DOMContentLoaded", () => {

    const nameElement =
        document.getElementById("trainerName");

    // Read the trainer profile saved during signup
    let profile = {};

    try {

        profile =
            JSON.parse(
                localStorage.getItem(STORAGE_KEY)
            ) || {};

    } catch (error) {

        console.error(
            "Unable to load trainer profile:",
            error
        );
    }

    // Show trainer's actual name
    if (nameElement) {

        nameElement.textContent =
            profile.fullName || "Trainer";
    }

    // Prevent accidental navigation animation
    const cards =
        document.querySelectorAll(".dashboard-card");

    cards.forEach((card) => {

        card.addEventListener("click", () => {

            card.classList.add("card-clicked");

        });

    });

});