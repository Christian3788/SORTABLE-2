import { state } from "./state.js";

export function syncStateToURL() {
  const params = new URLSearchParams();
  if (state.filter.query) params.set("q", state.filter.query);
  if (state.filter.field !== "name") params.set("f", state.filter.field);
  if (state.filter.operator !== "include") params.set("op", state.filter.operator);
  if (state.sort.column !== "name") params.set("sc", state.sort.column);
  if (state.sort.direction !== "asc") params.set("sd", state.sort.direction);
  if (state.pagination.page > 1) params.set("p", state.pagination.page);
  if (state.pagination.pageSize !== 20) params.set("size", state.pagination.pageSize);
  if (state.selectedHeroId) params.set("hero", state.selectedHeroId);

  const queryStr = params.toString();
  const nextUrl = queryStr ? `${window.location.pathname}?${queryStr}` : window.location.pathname;
  window.history.replaceState({}, "", nextUrl);
}

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
    state.pagination.pageSize = sz === "all" ? "all" : parseInt(sz, 10) || 20;
  }
  if (params.has("hero")) state.selectedHeroId = parseInt(params.get("hero"), 10);

  document.getElementById("search-input").value = state.filter.query;
  document.getElementById("search-field").value = state.filter.field;
  document.getElementById("search-operator").value = state.filter.operator;
  document.getElementById("page-size").value = state.pagination.pageSize;
}

export function openDossier(heroId) {
  const hero = state.rawHeroes.find((h) => h.id === Number(heroId));
  if (!hero) return;

  state.selectedHeroId = hero.id;
  syncStateToURL();

  const modal = document.getElementById("dossier-modal");
  const content = document.getElementById("modal-content");

  content.innerHTML = `
    <div class="dossier-layout">
      <img src="${hero.largeImage}" alt="${hero.name}" class="dossier-img">
      <div class="dossier-info">
        <h2>${hero.name}</h2>
        <h4>${hero.fullName || "Unregistered Identity"}</h4>
        <p><strong>Alignment:</strong> ${hero.alignment ? hero.alignment.toUpperCase() : "UNKNOWN"}</p>
        <p><strong>Publisher:</strong> ${hero.publisher || "Independent / Unlisted"}</p>
        <p><strong>Origin:</strong> ${hero.placeOfBirth || "Classified / Unknown"}</p>
        <p><strong>Species / Gender:</strong> ${hero.race || "Unknown"} &bull; ${hero.gender || "Unknown"}</p>
        <p><strong>Occupation:</strong> ${hero.workOccupation || "None on record"}</p>
        <p><strong>Affiliations:</strong> ${hero.groupAffiliation || "Autonomous operative"}</p>
      </div>
    </div>
    <div class="dossier-grid">
      <div>INT: <strong>${hero.intelligence ?? "-"}</strong></div>
      <div>STR: <strong>${hero.strength ?? "-"}</strong></div>
      <div>SPD: <strong>${hero.speed ?? "-"}</strong></div>
      <div>DUR: <strong>${hero.durability ?? "-"}</strong></div>
      <div>PWR: <strong>${hero.power ?? "-"}</strong></div>
      <div>CMB: <strong>${hero.combat ?? "-"}</strong></div>
      <div>HGT: <strong>${hero.height || "-"}</strong></div>
      <div>WGT: <strong>${hero.weight || "-"}</strong></div>
    </div>
  `;

  modal.classList.remove("hidden");
}

export function closeDossier() {
  state.selectedHeroId = null;
  syncStateToURL();
  document.getElementById("dossier-modal").classList.add("hidden");
}