import { API_URL, state, normalizeHero } from "./state.js";
import { applyFilters, applySort } from "./filterSort.js";
import { render } from "./render.js";
import { syncStateToURL, readStateFromURL, openDossier, closeDossier } from "./dossierUrl.js";

function setupListeners() {
  // Live search input
  document.getElementById("search-input").addEventListener("input", (e) => {
    state.filter.query = e.target.value;
    applyFilters();
    syncStateToURL();
    render();
  });

  // Vector / Operator dropdown updates
  document.getElementById("search-field").addEventListener("change", (e) => {
    state.filter.field = e.target.value;
    applyFilters();
    syncStateToURL();
    render();
  });

  document.getElementById("search-operator").addEventListener("change", (e) => {
    state.filter.operator = e.target.value;
    applyFilters();
    syncStateToURL();
    render();
  });

  // Column header sorting
  document.querySelector("thead").addEventListener("click", (e) => {
    const th = e.target.closest("th.sortable");
    if (!th) return;

    const column = th.dataset.column;
    if (state.sort.column === column) {
      state.sort.direction = state.sort.direction === "asc" ? "desc" : "asc";
    } else {
      state.sort.column = column;
      state.sort.direction = "asc";
    }

    applySort();
    syncStateToURL();
    render();
  });

  // Pagination limit and navigation
  document.getElementById("page-size").addEventListener("change", (e) => {
    state.pagination.pageSize = e.target.value === "all" ? "all" : parseInt(e.target.value, 10);
    state.pagination.page = 1;
    syncStateToURL();
    render();
  });

  document.getElementById("btn-first").addEventListener("click", () => {
    state.pagination.page = 1;
    syncStateToURL();
    render();
  });

  document.getElementById("btn-prev").addEventListener("click", () => {
    if (state.pagination.page > 1) {
      state.pagination.page--;
      syncStateToURL();
      render();
    }
  });

  document.getElementById("btn-next").addEventListener("click", () => {
    const totalPages = Math.ceil(state.filteredHeroes.length / state.pagination.pageSize);
    if (state.pagination.page < totalPages) {
      state.pagination.page++;
      syncStateToURL();
      render();
    }
  });

  document.getElementById("btn-last").addEventListener("click", () => {
    const totalPages = Math.ceil(state.filteredHeroes.length / state.pagination.pageSize);
    state.pagination.page = totalPages;
    syncStateToURL();
    render();
  });

  // Modal event bindings
  document.getElementById("table-body").addEventListener("click", (e) => {
    const row = e.target.closest("tr[data-hero-id]");
    if (row) openDossier(row.dataset.heroId);
  });

  document.getElementById("modal-close-btn").addEventListener("click", closeDossier);
  document.querySelector(".modal-backdrop").addEventListener("click", closeDossier);
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDossier();
  });
}

function init() {
  setupListeners();
  readStateFromURL();

  fetch(API_URL)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      return res.json();
    })
    .then((data) => {
      state.rawHeroes = data.map(normalizeHero);
      applyFilters();
      render();

      if (state.selectedHeroId) {
        openDossier(state.selectedHeroId);
      }
    })
    .catch((err) => {
      console.error("Data stream failed:", err);
      document.getElementById("table-body").innerHTML = `
        <tr><td colspan="15" class="status-cell">
          NETWORK ERROR: Failed to stream confidential metahuman feed.
        </td></tr>
      `;
    });
}

document.addEventListener("DOMContentLoaded", init);