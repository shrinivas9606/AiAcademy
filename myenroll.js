document.getElementById("year").textContent = new Date().getFullYear();

const form = document.getElementById("searchForm");
const input = document.getElementById("query");
const cards = document.getElementById("cards");
const empty = document.getElementById("empty");
const loading = document.getElementById("loading");
const meta = document.getElementById("resultMeta");

let cache = null;
let debounceTimer;

input.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => runSearch(input.value.trim()), 250);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  runSearch(input.value.trim());
});

async function runSearch(query) {
  if (!cache) {
    await loadData();
  }
  const q = (query || "").toLowerCase();
  if (!q) {
    cards.innerHTML = "";
    empty.hidden = false;
    meta.hidden = true;
    return;
  }

  const matched = cache.filter(s =>
    s.rollNumber.toLowerCase().includes(q) ||
    s.name.toLowerCase().includes(q)
  );

  render(matched, q);
}

async function loadData() {
  try {
    loading.hidden = false;
    const res = await fetch("myenroll.json", { cache: "no-store" });
    cache = await res.json();
  } catch (e) {
    console.error("Failed to load data", e);
    cache = [];
  } finally {
    loading.hidden = true;
  }
}

function render(students, q) {
  cards.innerHTML = "";

  if (!students.length) {
    empty.hidden = false;
    meta.hidden = true;
    return;
  }
  empty.hidden = true;

  meta.hidden = false;
  meta.textContent = `Found ${students.length} student${students.length > 1 ? "s" : ""} for “${q}”.`;

  const frag = document.createDocumentFragment();

  students.forEach((s) => {
    const card = document.createElement("article");
    card.className = "card";

    const head = document.createElement("div");
    head.className = "card-head";

    const title = document.createElement("h3");
    title.innerHTML = `🤖 ${highlight(s.name, q)}`;

    const id = document.createElement("div");
    id.className = "card-id";
    id.innerHTML = `Roll: <strong>${highlight(s.rollNumber, q)}</strong>`;

    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = `${s.courses?.length || 0} course${(s.courses?.length || 0) > 1 ? "s" : ""}`;

    head.appendChild(title);
    head.appendChild(id);
    head.appendChild(badge);

    const wrap = document.createElement("div");
    wrap.className = "table-wrap";
    const table = document.createElement("table");

    table.innerHTML = `
      <thead>
        <tr>
          <th>📘 Course</th>
          <th>Start</th>
          <th>End</th>
          <th>Duration</th>
          <th>Payment</th>
        </tr>
      </thead>
      <tbody>
        ${(s.courses || []).map(c => `
          <tr>
            <td><strong>${escapeHTML(c.courseName)}</strong><br><small>${c.code ? escapeHTML(c.code) : ""}</small></td>
            <td>${escapeHTML(c.startDate)}</td>
            <td>${escapeHTML(c.endDate)}</td>
            <td>${escapeHTML(c.duration)}</td>
            <td>${paymentTag(c.paymentStatus)}</td>
          </tr>
        `).join("")}
      </tbody>
    `;

    wrap.appendChild(table);
    card.appendChild(head);
    card.appendChild(wrap);
    frag.appendChild(card);
  });

  cards.appendChild(frag);
}

function paymentTag(statusRaw = "") {
  const s = statusRaw.toLowerCase();
  if (s.includes("paid")) return `<span class="tag paid">Paid</span>`;
  if (s.includes("pending")) return `<span class="tag pending">Pending</span>`;
  if (s.includes("fail")) return `<span class="tag failed">Failed</span>`;
  return `<span class="tag">${escapeHTML(statusRaw || "—")}</span>`;
}

function highlight(text = "", q = "") {
  if (!q) return escapeHTML(text);
  const escQ = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return escapeHTML(text).replace(new RegExp(escQ, "gi"), m => `<mark>${m}</mark>`);
}

function escapeHTML(s = "") {
  return s.replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m]));
}

document.addEventListener("DOMContentLoaded", () => {
  empty.hidden = false;
});
