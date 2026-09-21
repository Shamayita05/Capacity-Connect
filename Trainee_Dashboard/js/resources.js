/* ============================================================
   CAPACITY CONNECT - RESOURCES MODULE LOGIC
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("resources-table-body")) {
    renderResources();
    setupResourceFilters();
  }
});

function renderResources() {
  const tbody = document.getElementById("resources-table-body");
  if (!tbody) return;

  const resources = JSON.parse(localStorage.getItem("capacity_resources")) || [];
  const searchVal = document.getElementById("res-search")?.value.toLowerCase() || "";
  const typeVal = document.getElementById("res-type-filter")?.value || "";

  const filtered = resources.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchVal) || r.courseName.toLowerCase().includes(searchVal);
    const matchesType = typeVal === "" || r.type === typeVal;
    return matchesSearch && matchesType;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 20px;">No resources found.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(r => `
    <tr>
      <td><strong>${r.title}</strong></td>
      <td>${r.courseName}</td>
      <td>${r.trainer}</td>
      <td><span class="tag">${r.type}</span></td>
      <td>
        <button class="btn btn-secondary" style="padding: 4px 10px; font-size: 12px;" onclick="downloadResource('${r.title}')">View / Download</button>
      </td>
    </tr>
  `).join("");
}

function setupResourceFilters() {
  ["res-search", "res-type-filter"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", renderResources);
  });
}

function downloadResource(title) {
  showToast(`Downloading resource: ${title}`);
}