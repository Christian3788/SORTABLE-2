import { getVisibleHeroes } from "../features/pagination.js";
import { state } from "../state/store.js";

const TABLE_BODY_SELECTOR = "#table-body";
const COLUMN_COUNT = 15;
const MISSING_MARKUP = `<span style="color: var(--text-faint);">-</span>`;

const alignmentClass = (alignment) => {
  switch (alignment) {
    case "good": return "badge-good";
    case "bad": return "badge-bad";
    case "neutral": return "badge-neutral";
    default: return "badge-empty";
  }
};

const mono = (value) => `<span style="font-family: var(--font-mono);">${value}</span>`;

const stat = (value) => (value !== null && value !== undefined ? mono(value) : MISSING_MARKUP);

function heroRow(hero) {
  return `
    <tr data-hero-id="${hero.id}">
      <td><img src="${hero.icon || ""}" alt="" class="hero-thumb" loading="lazy"></td>
      <td><strong>${hero.name || "-"}</strong></td>
      <td>${hero.fullName || MISSING_MARKUP}</td>
      <td>${stat(hero.intelligence)}</td>
      <td>${stat(hero.strength)}</td>
      <td>${stat(hero.speed)}</td>
      <td>${stat(hero.durability)}</td>
      <td>${stat(hero.power)}</td>
      <td>${stat(hero.combat)}</td>
      <td>${hero.race || MISSING_MARKUP}</td>
      <td>${hero.gender || MISSING_MARKUP}</td>
      <td>${hero.height ? mono(hero.height) : MISSING_MARKUP}</td>
      <td>${hero.weight ? mono(hero.weight) : MISSING_MARKUP}</td>
      <td>${hero.placeOfBirth || MISSING_MARKUP}</td>
      <td><span class="badge ${alignmentClass(hero.alignment)}">${hero.alignment || "Unknown"}</span></td>
    </tr>
  `;
}

/** Render the current page of heroes into the table body. */
export function renderTable() {
  const tbody = document.querySelector(TABLE_BODY_SELECTOR);
  if (!tbody) return;

  if (state.filteredHeroes.length === 0) {
    renderStatusRow("No matching metahuman records found.");
    return;
  }

  tbody.innerHTML = getVisibleHeroes().map(heroRow).join("");
}

/** Replace the table body with a single full-width status message. */
export function renderStatusRow(message) {
  const tbody = document.querySelector(TABLE_BODY_SELECTOR);
  if (!tbody) return;
  tbody.innerHTML = `<tr><td colspan="${COLUMN_COUNT}" class="status-cell">${message}</td></tr>`;
}

/** Reflect the active sort column/direction on the header cells. */
export function renderSortIndicators() {
  document.querySelectorAll("th.sortable").forEach((th) => {
    th.classList.remove("sort-asc", "sort-desc");
    if (th.dataset.column === state.sort.column) {
      th.classList.add(state.sort.direction === "asc" ? "sort-asc" : "sort-desc");
    }
  });
}
