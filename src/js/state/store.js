import { DEFAULT_FILTER, DEFAULT_PAGE_SIZE, DEFAULT_SORT } from "../config/constants.js";

/**
 * Single source of truth for the application's runtime state.
 * Mutated in place by feature modules so every consumer sees the same object.
 */
export const state = {
  rawHeroes: [],
  filteredHeroes: [],
  sort: { ...DEFAULT_SORT },
  pagination: { page: 1, pageSize: DEFAULT_PAGE_SIZE },
  filter: { ...DEFAULT_FILTER },
  selectedHeroId: null,
};

/** Replace the normalized dataset and reset derived collections. */
export function setHeroes(heroes) {
  state.rawHeroes = heroes;
  state.filteredHeroes = [...heroes];
}

/** Return to the first page of results. */
export function resetPage() {
  state.pagination.page = 1;
}

/** True when pagination is disabled by the "all results" page size. */
export function isPaginated() {
  return state.pagination.pageSize !== "all";
}
