// ================================
// CAPACITY CONNECT - TRAINER PROFILE
// ================================

const STORAGE_KEY = "capacityConnectTrainerProfile";

const defaultProfile = {
    role: "Trainer",
    fullName: "Trainer",
    email: "trainer@example.com",
    mobile: "",
    designation: "Trainer",
    organization: "Capacity Connect",
    employeeId: "EMP-0000",

    officeRegion: "",
    trainingExperience: "",
    languages: "",

    highestQualification: "",
    institution: "",
    passingYear: "",

    subjectExpertise: "",
    keySkills: "",
    proficiencyLevel: "",
    preferredMode: "",

    bio: "",

    profileImage: "",
    imageFileName: ""
};


/* ================================
   STORAGE
================================ */

function getProfile() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        return saved
            ? { ...defaultProfile, ...JSON.parse(saved) }
            : { ...defaultProfile };

    } catch (error) {
        console.error("Unable to read trainer profile:", error);
        return { ...defaultProfile };
    }
}


function saveProfile(profile) {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(profile)
        );

        return true;

    } catch (error) {
        console.error("Unable to save trainer profile:", error);
        return false;
    }
}


/* ================================
   HELPERS
================================ */

function $(id) {
    return document.getElementById(id);
}


function getInitials(name) {
    const cleanName = (name || "Trainer").trim();

    const parts = cleanName
        .split(/\s+/)
        .filter(Boolean);

    if (parts.length === 1) {
        return parts[0]
            .slice(0, 2)
            .toUpperCase();
    }

    return (
        parts[0][0] +
        parts[parts.length - 1][0]
    ).toUpperCase();
}


function setField(id, value) {
    const element = $(id);

    if (element) {
        element.value = value ?? "";
    }
}


function readField(id) {
    const element = $(id);

    return element
        ? element.value.trim()
        : "";
}


/* ================================
   RENDER PROFILE
================================ */

function renderProfile(profile) {

    // Account details
    setField("role", profile.role);
    setField("fullName", profile.fullName);
    setField("email", profile.email);
    setField("mobile", profile.mobile);

    // Professional details
    setField("designation", profile.designation);
    setField("organization", profile.organization);
    setField("employeeId", profile.employeeId);
    setField("officeRegion", profile.officeRegion);
    setField(
        "trainingExperience",
        profile.trainingExperience
    );
    setField("languages", profile.languages);

    // Qualifications
    setField(
        "highestQualification",
        profile.highestQualification
    );
    setField(
        "institution",
        profile.institution
    );
    setField(
        "passingYear",
        profile.passingYear
    );

    // Competency mapping
    setField(
        "subjectExpertise",
        profile.subjectExpertise
    );
    setField(
        "keySkills",
        profile.keySkills
    );
    setField(
        "proficiencyLevel",
        profile.proficiencyLevel
    );
    setField(
        "preferredMode",
        profile.preferredMode
    );

    // Bio
    setField("bio", profile.bio);

    // Profile heading
    if ($("profileDisplayName")) {
        $("profileDisplayName").textContent =
            profile.fullName || "Trainer";
    }

    if ($("profileDisplayRole")) {
        $("profileDisplayRole").textContent =
            profile.designation ||
            profile.role ||
            "Trainer";
    }

    // Image filename
    if ($("imageFileName")) {
        $("imageFileName").textContent =
            profile.imageFileName ||
            "No image uploaded";
    }

    renderAvatar(profile);
}


/* ================================
   PROFILE IMAGE
================================ */

function renderAvatar(profile) {

    const avatar = $("profileAvatar");

    if (!avatar) return;

    if (profile.profileImage) {

        avatar.innerHTML = "";

        const image = document.createElement("img");

        image.src = profile.profileImage;
        image.alt = "Trainer profile image";

        avatar.appendChild(image);

    } else {

        avatar.textContent =
            getInitials(profile.fullName);
    }
}


function handleImageUpload(event) {

    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {

        console.error(
            "Please select a valid image file."
        );

        event.target.value = "";
        return;
    }

    const reader = new FileReader();

    reader.onload = () => {

        const profile = getProfile();

        profile.profileImage = reader.result;
        profile.imageFileName = file.name;

        if (!saveProfile(profile)) return;

        renderAvatar(profile);

        if ($("imageFileName")) {
            $("imageFileName").textContent =
                file.name;
        }
    };

    reader.readAsDataURL(file);
}


function removeProfileImage() {

    const profile = getProfile();

    profile.profileImage = "";
    profile.imageFileName = "";

    saveProfile(profile);

    renderAvatar(profile);

    if ($("imageFileName")) {
        $("imageFileName").textContent =
            "No image uploaded";
    }

    if ($("profileImage")) {
        $("profileImage").value = "";
    }
}

function collectEditableFields() {

    const profile = getProfile();

    // Contact
    profile.email = readField("email");
    profile.mobile = readField("mobile");

    // Professional details
    profile.officeRegion = readField("officeRegion");
    profile.trainingExperience = readField("trainingExperience");
    profile.languages = readField("languages");

    // Competency mapping
    profile.subjectExpertise = readField("subjectExpertise");
    profile.keySkills = readField("keySkills");
    profile.proficiencyLevel = readField("proficiencyLevel");
    profile.preferredMode = readField("preferredMode");

    // Bio
    profile.bio = readField("bio");

    // DO NOT change these:
    // highestQualification
    // institution
    // passingYear

    return profile;
}


/* ================================
   VALIDATION
================================ */

function validateProfile(profile) {

    if (!profile.email) {

        alert(
            "Please enter the trainer's email address."
        );

        $("email").focus();

        return false;
    }


    if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(profile.email)
    ) {

        alert(
            "Please enter a valid email address."
        );

        $("email").focus();

        return false;
    }


    if (!profile.mobile) {

        alert(
            "Please enter the trainer's mobile number."
        );

        $("mobile").focus();

        return false;
    }


    if (!profile.subjectExpertise) {

        alert(
            "Please enter the subject expertise."
        );

        $("subjectExpertise").focus();

        return false;
    }


    return true;
}


/* ================================
   SAVE CHANGES
================================ */

function saveChanges(event) {

    event.preventDefault();

    const profile =
        collectEditableFields();

    if (!validateProfile(profile)) {
        return;
    }

    if (!saveProfile(profile)) {

        alert(
            "The profile could not be saved."
        );

        return;
    }

    renderProfile(profile);

    if ($("saveMessage")) {

        $("saveMessage").textContent =
            "Profile changes saved successfully.";

        setTimeout(() => {

            $("saveMessage").textContent = "";

        }, 3000);
    }
}


/* ================================
   CANCEL CHANGES
================================ */

function cancelChanges() {

    const profile = getProfile();

    renderProfile(profile);

    if ($("saveMessage")) {

        $("saveMessage").textContent =
            "Changes discarded.";

        setTimeout(() => {

            $("saveMessage").textContent = "";

        }, 2000);
    }
}


/* ================================
   INITIALIZE PAGE
================================ */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const profile = getProfile();

        renderProfile(profile);


        // Profile form
        const profileForm = $("profileForm");

        if (profileForm) {
            profileForm.addEventListener(
                "submit",
                saveChanges
            );
        }


        // Profile image
        const profileImage =
            $("profileImage");

        if (profileImage) {
            profileImage.addEventListener(
                "change",
                handleImageUpload
            );
        }


        // Remove image
        const removeImageBtn =
            $("removeImageBtn");

        if (removeImageBtn) {
            removeImageBtn.addEventListener(
                "click",
                removeProfileImage
            );
        }


        // Cancel buttons
        const cancelBtn = $("cancelBtn");

        if (cancelBtn) {
            cancelBtn.addEventListener(
                "click",
                cancelChanges
            );
        }


        const cancelTopBtn =
            $("cancelTopBtn");

        if (cancelTopBtn) {
            cancelTopBtn.addEventListener(
                "click",
                cancelChanges
            );
        }


        // Footer year
        if ($("year")) {
            $("year").textContent =
                new Date().getFullYear();
        }
    }
);