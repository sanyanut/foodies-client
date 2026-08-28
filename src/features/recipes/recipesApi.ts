import { apiRequest } from "../../lib/apiClient.ts";

import type { RecipesQuery, RecipesResponse } from "./types.ts";

function buildRecipesPath(query: RecipesQuery): string {
  const params = new URLSearchParams();

  if (query.category) params.set("category", query.category);
  if (query.area) params.set("area", query.area);
  if (query.ingredient) params.set("ingredient", query.ingredient);
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));

  const search = params.toString();

  return `/recipes${search ? `?${search}` : ""}`;
}

export function getRecipes(
  query: RecipesQuery,
  signal?: AbortSignal,
): Promise<RecipesResponse> {
  return apiRequest<RecipesResponse>(buildRecipesPath(query), { signal });
}
