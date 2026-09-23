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

  tbody.innerHTML = `
    <tr>
      <td><strong>Python Cheat Sheet PDF</strong></td>
      <td>Python for Data Analysis</td>
      <td>Ananya Sharma</td>
      <td><span class="tag">PDF</span></td>
      <td>
        <button class="btn btn-secondary" style="padding: 4px 10px; font-size: 12px;" onclick="downloadResource('Python Cheat Sheet PDF')">
          View / Download
        </button>
      </td>
    </tr>

    <tr>
      <td><strong>Network Security Slides</strong></td>
      <td>Cybersecurity Fundamentals</td>
      <td>Shamayita Das</td>
      <td><span class="tag">PPTX</span></td>
      <td>
        <button class="btn btn-secondary" style="padding: 4px 10px; font-size: 12px;" onclick="downloadResource('Network Security Slides')">
          View / Download
        </button>
      </td>
    </tr>

    <tr>
      <td><strong>SQL Commands Reference</strong></td>
      <td>Database Management Systems</td>
      <td>Priya Nair</td>
      <td><span class="tag">DOCX</span></td>
      <td>
        <button class="btn btn-secondary" style="padding: 4px 10px; font-size: 12px;" onclick="downloadResource('SQL Commands Reference')">
          View / Download
        </button>
      </td>
    </tr>
  `;
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