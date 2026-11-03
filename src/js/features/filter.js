import { FILTER_OPERATORS, NUMERIC_OPERATORS } from "../config/constants.js";
import { resolveNumericValue } from "../data/heroFields.js";
import { resetPage, state } from "../state/store.js";
import { applySort } from "./sort.js";

/** Subsequence match: every query character appears in order. */
export function fuzzyMatch(text, query) {
  if (!text || !query) return false;
  text = text.toLowerCase();
  query = query.toLowerCase();

  let tIdx = 0;
  let qIdx = 0;
  while (tIdx < text.length && qIdx < query.length) {
    if (text[tIdx] === query[qIdx]) {
      qIdx++;
    }
    tIdx++;
  }
  return qIdx === query.length;
}

/**
 * Evaluate one hero field against the active operator.
 * Numeric operators ignore non-numeric queries; string operators
 * fall back to case-insensitive contains/fuzzy matching.
 */
export function evaluateFilter(heroVal, rawNumeric, operator, query) {
  const isNumericField = rawNumeric !== undefined;
  const numQuery = parseFloat(query);

  if (NUMERIC_OPERATORS.includes(operator)) {
    if (isNaN(numQuery)) return true;
    const target = isNumericField ? rawNumeric : parseFloat(heroVal);
    if (target === null || isNaN(target)) return false;

    switch (operator) {
      case FILTER_OPERATORS.EQUAL: return target === numQuery;
      case FILTER_OPERATORS.NOT_EQUAL: return target !== numQuery;
      case FILTER_OPERATORS.GREATER_THAN: return target > numQuery;
      case FILTER_OPERATORS.LESS_THAN: return target < numQuery;
      default: return true;
    }
  }

  const strVal = heroVal ? String(heroVal).toLowerCase() : "";
  const lowerQuery = query.toLowerCase();

  switch (operator) {
    case FILTER_OPERATORS.INCLUDE:
      return strVal.includes(lowerQuery);
    case FILTER_OPERATORS.EXCLUDE:
      return !strVal.includes(lowerQuery);
    case FILTER_OPERATORS.FUZZY:
      return fuzzyMatch(strVal, lowerQuery);
    default:
      return true;
  }
}

/** Rebuild the filtered collection from state, then sort and reset paging. */
export function applyFilters() {
  const { field, operator, query } = state.filter;

  if (!query.trim()) {
    state.filteredHeroes = [...state.rawHeroes];
  } else {
    state.filteredHeroes = state.rawHeroes.filter((hero) =>
      evaluateFilter(hero[field], resolveNumericValue(hero, field), operator, query.trim())
    );
  }

  applySort();
  resetPage();
}
