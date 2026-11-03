import { state } from "../state/store.js";

/** "all" disables paging; otherwise the active numeric page size. */
export function getPageSize() {
  return state.pagination.pageSize;
}

export function getTotalPages(total = state.filteredHeroes.length) {
  const pageSize = getPageSize();
  return pageSize === "all" ? 1 : Math.max(1, Math.ceil(total / pageSize));
}

/** Slice the filtered collection down to the rows for the current page. */
export function getVisibleHeroes() {
  const pageSize = getPageSize();
  const total = state.filteredHeroes.length;

  if (pageSize === "all") return state.filteredHeroes.slice(0, total);

  const start = (state.pagination.page - 1) * pageSize;
  return state.filteredHeroes.slice(start, start + pageSize);
}

/** Clamp the active page between 1 and the last page. */
export function setPage(page) {
  const totalPages = getTotalPages();
  state.pagination.page = Math.min(Math.max(1, page), totalPages);
}

/** Return false when the requested direction is already at a boundary. */
export function canGoToPage(page) {
  return getPageSize() !== "all" && page >= 1 && page <= getTotalPages();
}
