/* ============================================================
   CAPACITY CONNECT - NOTIFICATIONS MODULE LOGIC
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("notifications-list")) {
    renderNotifications();
  }
});

function renderNotifications() {
  const list = document.getElementById("notifications-list");
  if (!list) return;

  const notifications = JSON.parse(localStorage.getItem("capacity_notifications")) || [];

  if (notifications.length === 0) {
    list.innerHTML = `<div class="empty-state"><h3>You're all caught up!</h3></div>`;
    return;
  }

  list.innerHTML = notifications.map((n, idx) => `
    <div style="background: ${n.read ? 'var(--white)' : 'rgba(168, 218, 220, 0.2)'}; border: 1px solid var(--gray-200); padding: 16px; border-radius: var(--radius-sm); margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <span class="tag" style="margin-bottom: 4px;">${n.category}</span>
        <h4 style="color: var(--navy); font-size: 15px;">${n.title}</h4>
        <p style="font-size: 13px; color: var(--gray-600);">${n.description}</p>
        <span style="font-size: 11px; color: var(--gray-600);">${n.date} at ${n.time}</span>
      </div>
      ${!n.read ? `<button class="btn btn-outline" style="font-size: 12px; padding: 4px 10px;" onclick="markRead(${idx})">Mark as Read</button>` : `<span style="font-size: 12px; color: var(--gray-600);">Read</span>`}
    </div>
  `).join("");
}

function markRead(index) {
  const notifications = JSON.parse(localStorage.getItem("capacity_notifications")) || [];
  notifications[index].read = true;
  localStorage.setItem("capacity_notifications", JSON.stringify(notifications));
  renderNotifications();
}

function markAllRead() {
  const notifications = JSON.parse(localStorage.getItem("capacity_notifications")) || [];
  notifications.forEach(n => n.read = true);
  localStorage.setItem("capacity_notifications", JSON.stringify(notifications));
  renderNotifications();
  showToast("All notifications marked as read!");
}