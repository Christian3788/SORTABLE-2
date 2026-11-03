import { DEFAULT_FILTER, DEFAULT_PAGE_SIZE, DEFAULT_SORT } from "../config/constants.js";
import { state } from "./store.js";

/**
 * Mirror the full application state into the URL so views are shareable.
 * Defaults are omitted to keep URLs short.
 */
export function syncStateToURL() {
  const params = new URLSearchParams();

  if (state.filter.query) params.set("q", state.filter.query);
  if (state.filter.field !== DEFAULT_FILTER.field) params.set("f", state.filter.field);
  if (state.filter.operator !== DEFAULT_FILTER.operator) params.set("op", state.filter.operator);
  if (state.sort.column !== DEFAULT_SORT.column) params.set("sc", state.sort.column);
  if (state.sort.direction !== DEFAULT_SORT.direction) params.set("sd", state.sort.direction);
  if (state.pagination.page > 1) params.set("p", state.pagination.page);
  if (state.pagination.pageSize !== DEFAULT_PAGE_SIZE) params.set("size", state.pagination.pageSize);
  if (state.selectedHeroId) params.set("hero", state.selectedHeroId);

  const queryStr = params.toString();
  const nextUrl = queryStr ? `${window.location.pathname}?${queryStr}` : window.location.pathname;
  window.history.replaceState({}, "", nextUrl);
}

/** Hydrate state from the current URL query string. */
export function readStateFromURL() {
  const params = new URLSearchParams(window.location.search);

  if (params.has("q")) state.filter.query = params.get("q");
  if (params.has("f")) state.filter.field = params.get("f");
  if (params.has("op")) state.filter.operator = params.get("op");
  if (params.has("sc")) state.sort.column = params.get("sc");
  if (params.has("sd")) state.sort.direction = params.get("sd");
  if (params.has("p")) state.pagination.page = parseInt(params.get("p"), 10) || 1;

  if (params.has("size")) {
    const sz = params.get("size");
    state.pagination.pageSize = sz === "all" ? "all" : parseInt(sz, 10) || DEFAULT_PAGE_SIZE;
  }

  if (params.has("hero")) state.selectedHeroId = parseInt(params.get("hero"), 10);
}
