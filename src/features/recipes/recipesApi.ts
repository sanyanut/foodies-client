import { apiRequest } from "../../lib/apiClient.ts";

import type {
  RecipeLookup,
  RecipesQuery,
  RecipesResponse,
  RecipeSummary,
} from "./types.ts";

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

export function getIngredients(signal?: AbortSignal): Promise<RecipeLookup[]> {
  return apiRequest<RecipeLookup[]>("/ingredients", { signal });
}

export function getAreas(signal?: AbortSignal): Promise<RecipeLookup[]> {
  return apiRequest<RecipeLookup[]>("/areas", { signal });
}

export function getCategories(signal?: AbortSignal): Promise<RecipeLookup[]> {
  return apiRequest<RecipeLookup[]>("/categories", { signal });
}

export function createRecipe(
  formData: FormData,
  signal?: AbortSignal,
): Promise<RecipeSummary> {
  return apiRequest<RecipeSummary>("/recipes", {
    method: "POST",
    body: formData,
    auth: true,
    signal,
  });
}
