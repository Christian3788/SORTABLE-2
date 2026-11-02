export const API_URL = "https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json";

export const state = {
  rawHeroes: [],
  filteredHeroes: [],
  sort: { column: "name", direction: "asc" },
  pagination: { page: 1, pageSize: 20 },
  filter: { field: "name", operator: "include", query: "" },
  selectedHeroId: null,
};

export function cleanString(val) {
  if (val === null || val === undefined) return null;
  const str = String(val).trim();
  return str === "" || str === "-" ? null : str;
}

export function parseHeightMetric(heightArr) {
  if (!Array.isArray(heightArr) || heightArr.length === 0) return null;

  for (const h of heightArr) {
    if (typeof h !== "string") continue;
    const clean = h.trim();

    // Meters e.g., "61.0 meters", "108.0 meters"
    const mMatch = clean.match(/([\d.]+)\s*meters?/i);
    if (mMatch) {
      const val = parseFloat(mMatch[1]) * 100;
      if (val > 0) return Math.round(val);
    }

    // Centimeters e.g., "203 cm"
    const cmMatch = clean.match(/([\d.]+)\s*cm/i);
    if (cmMatch) {
      const val = parseFloat(cmMatch[1]);
      if (val > 0) return Math.round(val);
    }

    // Feet/inches e.g., "6'8"
    const ftMatch = clean.match(/(\d+)'(?:(\d+))?/);
    if (ftMatch) {
      const feet = parseInt(ftMatch[1], 10);
      const inches = ftMatch[2] ? parseInt(ftMatch[2], 10) : 0;
      const totalInches = feet * 12 + inches;
      if (totalInches > 0) return Math.round(totalInches * 2.54);
    }
  }

  return null;
}

export function parseWeightMetric(weightArr) {
  if (!Array.isArray(weightArr) || weightArr.length === 0) return null;

  for (const w of weightArr) {
    if (typeof w !== "string") continue;
    const clean = w.trim();

    // Tons e.g., "18 tons", "90,000 tons"
    const tonMatch = clean.match(/([\d,]+)\s*tons?/i);
    if (tonMatch) {
      const tons = parseFloat(tonMatch[1].replace(/,/g, ""));
      if (tons > 0) return Math.round(tons * 907.185);
    }

    // Kilograms e.g., "441 kg"
    const kgMatch = clean.match(/([\d,.]+)\s*kg/i);
    if (kgMatch) {
      const kg = parseFloat(kgMatch[1].replace(/,/g, ""));
      if (kg > 0) return Math.round(kg);
    }

    // Pounds e.g., "980 lb"
    const lbMatch = clean.match(/([\d,.]+)\s*lb/i);
    if (lbMatch) {
      const lb = parseFloat(lbMatch[1].replace(/,/g, ""));
      if (lb > 0) return Math.round(lb * 0.453592);
    }
  }

  return null;
}

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