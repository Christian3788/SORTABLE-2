import { state } from "../state/store.js";

/** Push the current state into the search/pagination form controls. */
export function applyStateToControls() {
  document.getElementById("search-input").value = state.filter.query;
  document.getElementById("search-field").value = state.filter.field;
  document.getElementById("search-operator").value = state.filter.operator;
  document.getElementById("page-size").value = state.pagination.pageSize;
}
