/**
 * Application-wide configuration and defaults.
 */

export const API_URL = "https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json";

export const DEFAULT_PAGE_SIZE = 20;

export const DEFAULT_SORT = { column: "name", direction: "asc" };

export const DEFAULT_FILTER = { field: "name", operator: "include", query: "" };

export const SORT_DIRECTIONS = { ASC: "asc", DESC: "desc" };

export const FILTER_OPERATORS = {
  INCLUDE: "include",
  EXCLUDE: "exclude",
  FUZZY: "fuzzy",
  EQUAL: "eq",
  NOT_EQUAL: "neq",
  GREATER_THAN: "gt",
  LESS_THAN: "lt",
};

export const NUMERIC_OPERATORS = [
  FILTER_OPERATORS.EQUAL,
  FILTER_OPERATORS.NOT_EQUAL,
  FILTER_OPERATORS.GREATER_THAN,
  FILTER_OPERATORS.LESS_THAN,
];
