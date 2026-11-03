import { cleanString } from "../utils/strings.js";
import { parseHeightMetric, parseWeightMetric } from "../utils/units.js";

/**
 * Map one raw API record onto the flat hero shape used across the UI.
 */
export function normalizeHero(h) {
  const heightCm = parseHeightMetric(h.appearance?.height);
  const weightKg = parseWeightMetric(h.appearance?.weight);

  return {
    id: h.id,
    icon: h.images?.xs || "",
    largeImage: h.images?.lg || h.images?.md || h.images?.sm || h.images?.xs || "",
    name: cleanString(h.name),
    fullName: cleanString(h.biography?.fullName),
    intelligence: h.powerstats?.intelligence ?? null,
    strength: h.powerstats?.strength ?? null,
    speed: h.powerstats?.speed ?? null,
    durability: h.powerstats?.durability ?? null,
    power: h.powerstats?.power ?? null,
    combat: h.powerstats?.combat ?? null,
    race: cleanString(h.appearance?.race),
    gender: cleanString(h.appearance?.gender),
    height: heightCm !== null ? `${heightCm} cm` : null,
    heightRaw: heightCm,
    weight: weightKg !== null ? `${weightKg} kg` : null,
    weightRaw: weightKg,
    placeOfBirth: cleanString(h.biography?.placeOfBirth),
    alignment: cleanString(h.biography?.alignment),
    publisher: cleanString(h.biography?.publisher),
    workOccupation: cleanString(h.work?.occupation),
    groupAffiliation: cleanString(h.connections?.groupAffiliation),
  };
}
