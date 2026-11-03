import { SORT_DIRECTIONS } from "../config/constants.js";
import { resolveNumericValue } from "../data/heroFields.js";
import { state } from "../state/store.js";

function isMissing(val) {
  return val === null || val === undefined || val === "";
}

/**
 * Sort the filtered collection in place by the active sort column.
 * Missing values are pinned to the bottom in both directions.
 */
export function applySort() {
  const { column, direction } = state.sort;
  const factor = direction === SORT_DIRECTIONS.ASC ? 1 : -1;

  state.filteredHeroes.sort((a, b) => {
    let valA = resolveNumericValue(a, column) ?? a[column];
    let valB = resolveNumericValue(b, column) ?? b[column];

    const aIsMissing = isMissing(valA);
    const bIsMissing = isMissing(valB);

    if (aIsMissing && bIsMissing) return 0;
    if (aIsMissing) return 1;
    if (bIsMissing) return -1;

    if (typeof valA === "number" && typeof valB === "number") {
      return (valA - valB) * factor;
    }

    return String(valA).localeCompare(String(valB), undefined, { sensitivity: "base" }) * factor;
  });
}

/**
 * Toggle the direction when re-clicking the active column,
 * otherwise sort ascending by the newly selected column.
 */
export function setSortColumn(column) {
  if (state.sort.column === column) {
    state.sort.direction =
      state.sort.direction === SORT_DIRECTIONS.ASC ? SORT_DIRECTIONS.DESC : SORT_DIRECTIONS.ASC;
  } else {
    state.sort.column = column;
    state.sort.direction = SORT_DIRECTIONS.ASC;
  }
}
