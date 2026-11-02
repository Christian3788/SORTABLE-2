import { state } from "./state.js";

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

export function evaluateFilter(heroVal, rawNumeric, operator, query) {
  const isNumericField = rawNumeric !== undefined;
  const numQuery = parseFloat(query);

  if (["eq", "neq", "gt", "lt"].includes(operator)) {
    if (isNaN(numQuery)) return true;
    const target = isNumericField ? rawNumeric : parseFloat(heroVal);
    if (target === null || isNaN(target)) return false;

    switch (operator) {
      case "eq": return target === numQuery;
      case "neq": return target !== numQuery;
      case "gt": return target > numQuery;
      case "lt": return target < numQuery;
      default: return true;
    }
  }

  const strVal = heroVal ? String(heroVal).toLowerCase() : "";
  const lowerQuery = query.toLowerCase();

  switch (operator) {
    case "include":
      return strVal.includes(lowerQuery);
    case "exclude":
      return !strVal.includes(lowerQuery);
    case "fuzzy":
      return fuzzyMatch(strVal, lowerQuery);
    default:
      return true;
  }
}

export function applyFilters() {
  const { field, operator, query } = state.filter;

  if (!query.trim()) {
    state.filteredHeroes = [...state.rawHeroes];
  } else {
    state.filteredHeroes = state.rawHeroes.filter((hero) => {
      let heroVal = hero[field];
      let rawNumeric;

      if (field === "height") rawNumeric = hero.heightRaw;
      else if (field === "weight") rawNumeric = hero.weightRaw;
      else if (["intelligence", "strength", "speed", "durability", "power", "combat"].includes(field)) {
        rawNumeric = hero[field];
      }

      return evaluateFilter(heroVal, rawNumeric, operator, query.trim());
    });
  }

  applySort();
  state.pagination.page = 1;
}

export function applySort() {
  const { column, direction } = state.sort;
  const factor = direction === "asc" ? 1 : -1;

  state.filteredHeroes.sort((a, b) => {
    let valA = a[column];
    let valB = b[column];

    if (column === "height") {
      valA = a.heightRaw;
      valB = b.heightRaw;
    } else if (column === "weight") {
      valA = a.weightRaw;
      valB = b.weightRaw;
    }

    // Missing values always sorted last regardless of sort direction
    const aIsMissing = valA === null || valA === undefined || valA === "";
    const bIsMissing = valB === null || valB === undefined || valB === "";

    if (aIsMissing && bIsMissing) return 0;
    if (aIsMissing) return 1;
    if (bIsMissing) return -1;

    if (typeof valA === "number" && typeof valB === "number") {
      return (valA - valB) * factor;
    }

    return String(valA).localeCompare(String(valB), undefined, { sensitivity: "base" }) * factor;
  });
}