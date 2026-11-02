import { state } from "./state.js";

export function renderTable() {
  const tbody = document.getElementById("table-body");
  const { page, pageSize } = state.pagination;
  const total = state.filteredHeroes.length;

  if (total === 0) {
    tbody.innerHTML = `<tr><td colspan="15" class="status-cell">No matching metahuman records found.</td></tr>`;
    return;
  }

  const start = pageSize === "all" ? 0 : (page - 1) * pageSize;
  const end = pageSize === "all" ? total : start + pageSize;
  const visible = state.filteredHeroes.slice(start, end);

  tbody.innerHTML = visible.map((hero) => {
    const alignClass = 
      hero.alignment === "good" ? "badge-good" : 
      hero.alignment === "bad" ? "badge-bad" : 
      hero.alignment === "neutral" ? "badge-neutral" : "badge-empty";

    const stat = (v) => v !== null && v !== undefined 
      ? `<span style="font-family: var(--font-mono);">${v}</span>` 
      : `<span style="color: var(--text-faint);">-</span>`;

    return `
      <tr data-hero-id="${hero.id}">
        <td><img src="${hero.icon || ''}" alt="" class="hero-thumb" loading="lazy"></td>
        <td><strong>${hero.name || "-"}</strong></td>
        <td>${hero.fullName || `<span style="color: var(--text-faint);">-</span>`}</td>
        <td>${stat(hero.intelligence)}</td>
        <td>${stat(hero.strength)}</td>
        <td>${stat(hero.speed)}</td>
        <td>${stat(hero.durability)}</td>
        <td>${stat(hero.power)}</td>
        <td>${stat(hero.combat)}</td>
        <td>${hero.race || `<span style="color: var(--text-faint);">-</span>`}</td>
        <td>${hero.gender || `<span style="color: var(--text-faint);">-</span>`}</td>
        <td>${hero.height ? `<span style="font-family: var(--font-mono);">${hero.height}</span>` : `<span style="color: var(--text-faint);">-</span>`}</td>
        <td>${hero.weight ? `<span style="font-family: var(--font-mono);">${hero.weight}</span>` : `<span style="color: var(--text-faint);">-</span>`}</td>
        <td>${hero.placeOfBirth || `<span style="color: var(--text-faint);">-</span>`}</td>
        <td><span class="badge ${alignClass}">${hero.alignment || "Unknown"}</span></td>
      </tr>
    `;
  }).join("");
}

export function renderPagination() {
  const total = state.filteredHeroes.length;
  const { page, pageSize } = state.pagination;
  const totalPages = pageSize === "all" ? 1 : Math.max(1, Math.ceil(total / pageSize));

  document.getElementById("record-count").textContent = `Records: ${total} / ${state.rawHeroes.length}`;
  document.getElementById("sort-status").textContent = `Sort: ${state.sort.column} (${state.sort.direction.toUpperCase()})`;
  document.getElementById("page-indicator").textContent = `Page ${page} of ${totalPages}`;

  document.getElementById("btn-first").disabled = page <= 1 || pageSize === "all";
  document.getElementById("btn-prev").disabled = page <= 1 || pageSize === "all";
  document.getElementById("btn-next").disabled = page >= totalPages || pageSize === "all";
  document.getElementById("btn-last").disabled = page >= totalPages || pageSize === "all";

  // Visual header sort indicators
  document.querySelectorAll("th.sortable").forEach((th) => {
    th.classList.remove("sort-asc", "sort-desc");
    if (th.dataset.column === state.sort.column) {
      th.classList.add(state.sort.direction === "asc" ? "sort-asc" : "sort-desc");
    }
  });
}

export function render() {
  renderTable();
  renderPagination();
}