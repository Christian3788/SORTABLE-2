import { getPageSize, getTotalPages } from "../features/pagination.js";
import { state } from "../state/store.js";

/** Telemetry readout: visible record count and active sort. */
export function renderStats() {
  const total = state.filteredHeroes.length;
  document.getElementById("record-count").textContent =
    `Records: ${total} / ${state.rawHeroes.length}`;
  document.getElementById("sort-status").textContent =
    `Sort: ${state.sort.column} (${state.sort.direction.toUpperCase()})`;
}

/** Page indicator plus first/prev/next/last button availability. */
export function renderPagination() {
  const { page } = state.pagination;
  const totalPages = getTotalPages();
  const isAll = getPageSize() === "all";

  document.getElementById("page-indicator").textContent = `Page ${page} of ${totalPages}`;

  document.getElementById("btn-first").disabled = page <= 1 || isAll;
  document.getElementById("btn-prev").disabled = page <= 1 || isAll;
  document.getElementById("btn-next").disabled = page >= totalPages || isAll;
  document.getElementById("btn-last").disabled = page >= totalPages || isAll;
}
