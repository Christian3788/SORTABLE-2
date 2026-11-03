import { state } from "../state/store.js";
import { syncStateToURL } from "../state/urlSync.js";

const MODAL_ID = "dossier-modal";
const CONTENT_ID = "modal-content";

function dossierMarkup(hero) {
  return `
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
}

/** Open the dossier for a hero id and persist it in the URL. */
export function openDossier(heroId) {
  const hero = state.rawHeroes.find((h) => h.id === Number(heroId));
  if (!hero) return;

  state.selectedHeroId = hero.id;
  syncStateToURL();

  document.getElementById(CONTENT_ID).innerHTML = dossierMarkup(hero);
  document.getElementById(MODAL_ID).classList.remove("hidden");
}

/** Close the dossier and drop it from the URL. */
export function closeDossier() {
  state.selectedHeroId = null;
  syncStateToURL();
  document.getElementById(MODAL_ID).classList.add("hidden");
}
