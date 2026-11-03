import { API_URL } from "../config/constants.js";

/**
 * Fetch and normalize the metahuman dataset.
 * @returns {Promise<object[]>} raw API records
 */
export async function fetchHeroes(url = API_URL) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
  return res.json();
}
