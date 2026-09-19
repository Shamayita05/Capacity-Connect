const DB_NAME = "capacityConnectLibraryDB";
const DB_VERSION = 1;
const STORE_NAME = "resources";

let resources = [];
let selectedFile = null;
let editingResourceId = null;
let resourceToOpen = null;
let toastTimer = null;

const $ = (selector) => document.querySelector(selector);

document.addEventListener("DOMContentLoaded", async () => {
    bindEvents();
    await loadResources();
    renderResources();
});

function bindEvents() {
    $("#uploadButton").addEventListener("click", () => openResourceForm());
    $("#closeModal").addEventListener("click", closeResourceForm);
    $("#cancelButton").addEventListener("click", closeResourceForm);

    $("#closeViewModal").addEventListener("click", closeViewModal);
    $("#closeViewButton").addEventListener("click", closeViewModal);
    $("#openResourceButton").addEventListener("click", () => openResource(resourceToOpen));

    $("#resourceForm").addEventListener("submit", handleFormSubmit);

    $("#resourceFile").addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) setSelectedFile(file);
    });

    $("#chooseFileButton").addEventListener("click", () => $("#resourceFile").click());
    $("#removeFile").addEventListener("click", clearSelectedFile);

    const dropZone = $("#dropZone");
    ["dragenter", "dragover"].forEach((eventName) => {
        dropZone.addEventListener(eventName, (event) => {
            event.preventDefault();
            dropZone.classList.add("drag-over");
        });
    });
    ["dragleave", "drop"].forEach((eventName) => {
        dropZone.addEventListener(eventName, (event) => {
            event.preventDefault();
            dropZone.classList.remove("drag-over");
        });
    });
    dropZone.addEventListener("drop", (event) => {
        const file = event.dataTransfer.files[0];
        if (file) {
            selectedFile = file;
            updateSelectedFileUI();
        }
    });

    $("#searchInput").addEventListener("input", renderResources);
    $("#courseFilter").addEventListener("change", renderResources);

    $("#resourceTableBody").addEventListener("click", handleTableAction);

    [$("#resourceModal"), $("#viewModal")].forEach((modal) => {
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                modal.classList.remove("open");
                modal.setAttribute("aria-hidden", "true");
            }
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        closeResourceForm();
        closeViewModal();
    });
}

function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "id" });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function dbGetAll() {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
    });
}

async function dbPut(resource) {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite");
        transaction.objectStore(STORE_NAME).put(resource);
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
    });
}

async function dbDelete(id) {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite");
        transaction.objectStore(STORE_NAME).delete(id);
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
    });
}

async function loadResources() {
    try {
        resources = await dbGetAll();
        resources.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    } catch (error) {
        console.error(error);
        showToast("Could not load saved resources.");
        resources = [];
    }
}

function openResourceForm(resource = null) {
    editingResourceId = resource ? resource.id : null;
    selectedFile = null;

    $("#resourceForm").reset();
    $("#resourceId").value = resource ? resource.id : "";
    $("#modalTitle").textContent = resource ? "Edit Resource" : "Upload Resource";
    $("#saveButtonText").textContent = resource ? "Save Changes" : "Upload Resource";

    if (resource) {
        $("#resourceTitle").value = resource.title || "";
        $("#courseName").value = resource.course || "";
        $("#resourceCategory").value = resource.category || "Lecture";
        $("#courseDetails").value = resource.description || "";
        $("#moduleName").value = resource.module || "";
        $("#duration").value = resource.duration || "";
        $("#resourceTags").value = resource.tags || "";
        $("#visibility").value = resource.visibility || "All enrolled trainees";
        $("#resourceLink").value = resource.link || "";
        $("#trainerNotes").value = resource.notes || "";

        if (resource.fileName) {
            $("#selectedFileName").textContent = `${resource.fileName} (previously uploaded)`;
            $("#selectedFileSize").textContent = resource.fileSize ? formatBytes(resource.fileSize) : "Saved resource file";
            $("#selectedFile").classList.remove("hidden");
        }
    }

    $("#resourceModal").classList.add("open");
    $("#resourceModal").setAttribute("aria-hidden", "false");
    setTimeout(() => $("#resourceTitle").focus(), 50);
}

function closeResourceForm() {
    $("#resourceModal").classList.remove("open");
    $("#resourceModal").setAttribute("aria-hidden", "true");
    selectedFile = null;
    editingResourceId = null;
}

function setSelectedFile(file) {
    selectedFile = file;
    updateSelectedFileUI();
}

function updateSelectedFileUI() {
    if (!selectedFile) {
        $("#selectedFile").classList.add("hidden");
        return;
    }

    $("#selectedFileName").textContent = selectedFile.name;
    $("#selectedFileSize").textContent = formatBytes(selectedFile.size);
    $("#selectedFile").classList.remove("hidden");
}

function clearSelectedFile() {
    selectedFile = null;
    $("#resourceFile").value = "";
    $("#selectedFile").classList.add("hidden");
}

async function handleFormSubmit(event) {
    event.preventDefault();

    const title = $("#resourceTitle").value.trim();
    const course = $("#courseName").value.trim();
    const description = $("#courseDetails").value.trim();

    if (!title || !course || !description) {
        showToast("Please complete the required fields.");
        return;
    }

    const existing = editingResourceId
        ? resources.find((item) => item.id === editingResourceId)
        : null;

    const resource = {
        id: editingResourceId || createId(),
        title,
        course,
        category: $("#resourceCategory").value,
        description,
        module: $("#moduleName").value.trim(),
        duration: $("#duration").value.trim(),
        tags: $("#resourceTags").value.trim(),
        visibility: $("#visibility").value,
        link: $("#resourceLink").value.trim(),
        notes: $("#trainerNotes").value.trim(),
        fileName: selectedFile ? selectedFile.name : (existing?.fileName || ""),
        fileType: selectedFile ? selectedFile.type : (existing?.fileType || ""),
        fileSize: selectedFile ? selectedFile.size : (existing?.fileSize || 0),
        fileBlob: selectedFile || existing?.fileBlob || null,
        views: existing?.views || 0,
        enrolled: existing?.enrolled || 0,
        createdAt: existing?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    try {
        await dbPut(resource);
        await loadResources();
        renderResources();
        closeResourceForm();
        showToast(existing ? "Resource updated successfully." : "Resource uploaded successfully.");
    } catch (error) {
        console.error(error);
        showToast("The resource could not be saved. The file may be too large for browser storage.");
    }
}

function renderResources() {
    const searchTerm = $("#searchInput").value.trim().toLowerCase();
    const course = $("#courseFilter").value;

    updateCourseFilter(course);

    const filtered = resources.filter((resource) => {
        const matchesSearch =
            !searchTerm ||
            resource.title.toLowerCase().includes(searchTerm) ||
            resource.course.toLowerCase().includes(searchTerm) ||
            (resource.module || "").toLowerCase().includes(searchTerm) ||
            (resource.tags || "").toLowerCase().includes(searchTerm);

        const matchesCourse = course === "all" || resource.course === course;

        return matchesSearch && matchesCourse;
    });

    const tbody = $("#resourceTableBody");

    if (!filtered.length) {
        tbody.innerHTML = `
            <tr class="empty-row">
                <td colspan="6">
                    <div class="empty-state">
                        <div class="empty-icon">LB</div>
                        <h3>${resources.length ? "No matching resources" : "No resources uploaded yet"}</h3>
                        <p>${resources.length ? "Try a different search term or course filter." : "Use the upload button to add PDFs, presentations, documents, videos, images or useful links."}</p>
                    </div>
                </td>
            </tr>
        `;
        updateSummary();
        return;
    }

    tbody.innerHTML = filtered.map((resource) => `
        <tr>
            <td>
                <div class="resource-title">
                    <div class="resource-icon">${escapeHtml(typeShortName(resource))}</div>
                    <div>
                        <strong>${escapeHtml(resource.title)}</strong>
                        <small>${escapeHtml(resource.module || resource.category || "Learning resource")}</small>
                    </div>
                </div>
            </td>
            <td>
                <div class="course-info">
                    <strong>${escapeHtml(resource.course)}</strong>
                    <span>${escapeHtml(truncate(resource.description, 85))}</span>
                </div>
            </td>
            <td><span class="metric">${resource.views || 0}</span></td>
            <td><span class="metric">${resource.enrolled || 0}</span></td>
            <td><span class="type-badge">${escapeHtml(resource.category || detectType(resource))}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-button" type="button" data-action="view" data-id="${resource.id}" title="View resource" aria-label="View resource">View</button>
                    <button class="action-button" type="button" data-action="edit" data-id="${resource.id}" title="Edit resource" aria-label="Edit resource">Edit</button>
                    <button class="action-button delete" type="button" data-action="delete" data-id="${resource.id}" title="Delete resource" aria-label="Delete resource">Delete</button>
                </div>
            </td>
        </tr>
    `).join("");

    updateSummary();
}

function updateCourseFilter(currentValue = "all") {
    const select = $("#courseFilter");
    const courses = [...new Set(resources.map((resource) => resource.course).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b));

    select.innerHTML = `<option value="all">All courses</option>` +
        courses.map((course) => `<option value="${escapeAttribute(course)}">${escapeHtml(course)}</option>`).join("");

    select.value = courses.includes(currentValue) ? currentValue : "all";
}

function updateSummary() {
    $("#totalResources").textContent = resources.length;
    $("#totalViews").textContent = resources.reduce((sum, item) => sum + Number(item.views || 0), 0);
    $("#totalCourses").textContent = new Set(resources.map((item) => item.course).filter(Boolean)).size;
}

async function handleTableAction(event) {
    const button = event.target.closest("[data-action]");
    if (!button) return;

    const id = button.dataset.id;
    const resource = resources.find((item) => item.id === id);
    if (!resource) return;

    if (button.dataset.action === "view") {
        openViewModal(resource);
    }

    if (button.dataset.action === "edit") {
        openResourceForm(resource);
    }

    if (button.dataset.action === "delete") {
        await deleteResource(resource);
    }
}

function openViewModal(resource) {
    resourceToOpen = resource;

    $("#viewTitle").textContent = resource.title;
    $("#viewContent").innerHTML = `
        <div class="detail-grid">
            <div class="detail-item">
                <label>Course</label>
                <p>${escapeHtml(resource.course)}</p>
            </div>
            <div class="detail-item">
                <label>Category</label>
                <p>${escapeHtml(resource.category || detectType(resource))}</p>
            </div>
            <div class="detail-item">
                <label>Module / topic</label>
                <p>${escapeHtml(resource.module || "Not specified")}</p>
            </div>
            <div class="detail-item">
                <label>Duration</label>
                <p>${escapeHtml(resource.duration || "Not specified")}</p>
            </div>
            <div class="detail-item">
                <label>Trainees viewed</label>
                <p>${resource.views || 0}</p>
            </div>
            <div class="detail-item">
                <label>Trainees enrolled</label>
                <p>${resource.enrolled || 0}</p>
            </div>
            <div class="detail-item full">
                <label>Course information</label>
                <p>${escapeHtml(resource.description)}</p>
            </div>
            <div class="detail-item full">
                <label>Additional notes</label>
                <p>${escapeHtml(resource.notes || "No additional notes.")}</p>
            </div>
            <div class="detail-item full">
                <label>Resource</label>
                <p>${escapeHtml(resource.fileName || resource.link || "No file or external link attached.")}</p>
            </div>
        </div>
        <div class="view-file-note">
            ${resource.fileName
                ? "The Open Resource button will open the uploaded file in a new browser tab where the browser supports that file type."
                : resource.link
                    ? "The external link will open in a new browser tab."
                    : "This resource has no file or external link attached yet."}
        </div>
    `;

    $("#viewModal").classList.add("open");
    $("#viewModal").setAttribute("aria-hidden", "false");
}

function closeViewModal() {
    $("#viewModal").classList.remove("open");
    $("#viewModal").setAttribute("aria-hidden", "true");
    resourceToOpen = null;
}

async function openResource(resource) {
    if (!resource) return;

    let targetUrl = "";

    if (resource.link) {
        targetUrl = resource.link;
    } else if (resource.fileBlob) {
        targetUrl = URL.createObjectURL(resource.fileBlob);
    } else {
        showToast("No uploaded file or external link is available.");
        return;
    }

    const newWindow = window.open(targetUrl, "_blank", "noopener,noreferrer");

    if (!newWindow) {
        showToast("Please allow pop-ups to open the resource.");
        if (resource.fileBlob) URL.revokeObjectURL(targetUrl);
        return;
    }

    resource.views = Number(resource.views || 0) + 1;
    resource.updatedAt = new Date().toISOString();

    try {
        await dbPut(resource);
        await loadResources();
        renderResources();
    } catch (error) {
        console.error(error);
    }

    closeViewModal();

    if (resource.fileBlob) {
        setTimeout(() => URL.revokeObjectURL(targetUrl), 60000);
    }
}

async function deleteResource(resource) {
    const confirmed = window.confirm(
        `Delete "${resource.title}"?\n\nThis will remove the resource from the trainer library.`
    );

    if (!confirmed) return;

    try {
        await dbDelete(resource.id);
        await loadResources();
        renderResources();
        showToast("Resource deleted.");
    } catch (error) {
        console.error(error);
        showToast("The resource could not be deleted.");
    }
}

function createId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return `resource-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function detectType(resource) {
    if (resource.link) return "Link";

    const name = (resource.fileName || "").toLowerCase();
    if (name.endsWith(".pdf")) return "PDF";
    if (/\.(ppt|pptx)$/.test(name)) return "PPT";
    if (/\.(doc|docx)$/.test(name)) return "DOC";
    if (/\.(xls|xlsx)$/.test(name)) return "SHEET";
    if (/\.(mp4|webm|mov|avi|mkv)$/.test(name)) return "VIDEO";
    if (/\.(jpg|jpeg|png|gif|webp)$/.test(name)) return "IMAGE";
    return "FILE";
}

function typeShortName(resource) {
    if (resource.link) return "LINK";

    const type = detectType(resource);
    return type.length > 5 ? type.slice(0, 5) : type;
}

function formatBytes(bytes) {
    if (!bytes) return "";
    const units = ["B", "KB", "MB", "GB"];
    const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    return `${(bytes / Math.pow(1024, index)).toFixed(index ? 1 : 0)} ${units[index]}`;
}

function truncate(text, length) {
    if (!text) return "";
    return text.length > length ? `${text.slice(0, length - 1)}…` : text;
}

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
    return escapeHtml(value);
}

function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}