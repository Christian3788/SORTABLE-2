import { renderPagination, renderStats } from "./pagination.js";
import { renderSortIndicators, renderTable } from "./table.js";

/** Repaint every dynamic region of the interface. */
export function render() {
  renderTable();
  renderStats();
  renderPagination();
  renderSortIndicators();
}
