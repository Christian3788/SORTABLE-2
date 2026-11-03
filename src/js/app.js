import { fetchHeroes } from "./data/heroApi.js";
import { normalizeHero } from "./data/normalizeHero.js";
import { applyFilters } from "./features/filter.js";
import { canGoToPage, getPageSize, getTotalPages, setPage } from "./features/pagination.js";
import { applySort, setSortColumn } from "./features/sort.js";
import { resetPage, setHeroes, state } from "./state/store.js";
import { readStateFromURL, syncStateToURL } from "./state/urlSync.js";
import { applyStateToControls } from "./ui/controls.js";
import { closeDossier, openDossier } from "./ui/dossier.js";
import { render } from "./ui/render.js";
import { renderStatusRow } from "./ui/table.js";

function refresh() {
  syncStateToURL();
  render();
}

function bindSearchControls() {
  document.getElementById("search-input").addEventListener("input", (e) => {
    state.filter.query = e.target.value;
    applyFilters();
    refresh();
  });

  document.getElementById("search-field").addEventListener("change", (e) => {
    state.filter.field = e.target.value;
    applyFilters();
    refresh();
  });

  document.getElementById("search-operator").addEventListener("change", (e) => {
    state.filter.operator = e.target.value;
    applyFilters();
    refresh();
  });
}

function bindSorting() {
  document.querySelector("thead").addEventListener("click", (e) => {
    const th = e.target.closest("th.sortable");
    if (!th) return;

    setSortColumn(th.dataset.column);
    applySort();
    refresh();
  });
}

function bindPagination() {
  document.getElementById("page-size").addEventListener("change", (e) => {
    state.pagination.pageSize = e.target.value === "all" ? "all" : parseInt(e.target.value, 10);
    resetPage();
    refresh();
  });

  document.getElementById("btn-first").addEventListener("click", () => {
    setPage(1);
    refresh();
  });

  document.getElementById("btn-prev").addEventListener("click", () => {
    if (canGoToPage(state.pagination.page - 1)) {
      setPage(state.pagination.page - 1);
      refresh();
    }
  });

  document.getElementById("btn-next").addEventListener("click", () => {
    if (getPageSize() !== "all" && state.pagination.page < getTotalPages()) {
      setPage(state.pagination.page + 1);
      refresh();
    }
  });

  document.getElementById("btn-last").addEventListener("click", () => {
    if (getPageSize() === "all") return;
    setPage(getTotalPages());
    refresh();
  });
}

function bindDossier() {
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

function setupListeners() {
  bindSearchControls();
  bindSorting();
  bindPagination();
  bindDossier();
}

async function init() {
  setupListeners();
  readStateFromURL();
  applyStateToControls();

  try {
    const data = await fetchHeroes();
    setHeroes(data.map(normalizeHero));
    applyFilters();
    render();

    if (state.selectedHeroId) {
      openDossier(state.selectedHeroId);
    }
  } catch (err) {
    console.error("Data stream failed:", err);
    renderStatusRow("NETWORK ERROR: Failed to stream confidential metahuman feed.");
  }
}

document.addEventListener("DOMContentLoaded", init);
