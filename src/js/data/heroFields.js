/**
 * Field metadata shared by the filtering and sorting engines.
 */

export const POWER_STAT_FIELDS = [
  "intelligence",
  "strength",
  "speed",
  "durability",
  "power",
  "combat",
];

/** Fields compared as numbers rather than strings. */
export const NUMERIC_FIELDS = [...POWER_STAT_FIELDS, "height", "weight"];

/**
 * Resolve a hero field to its numeric form, or undefined when the field
 * is not numeric. Height/weight compare against their normalized metric
 * value so display strings such as "203 cm" never reach the comparison.
 */
export function resolveNumericValue(hero, field) {
  if (field === "height") return hero.heightRaw;
  if (field === "weight") return hero.weightRaw;
  if (POWER_STAT_FIELDS.includes(field)) return hero[field];
  return undefined;
}
