/**
 * Trim strings coming from the API and treat blanks/dashes as missing.
 */
export function cleanString(val) {
  if (val === null || val === undefined) return null;
  const str = String(val).trim();
  return str === "" || str === "-" ? null : str;
}
