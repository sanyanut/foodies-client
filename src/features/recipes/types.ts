export interface RecipeLookup {
  id: string;
  name: string;
  /** Ingredients from GET /ingredients also carry a thumbnail; categories/areas don't. */
  img?: string;
}

export interface RecipeOwner {
  name: string;
  avatar: string | null;
}

export interface RecipeCardData {
  id: string;
  title: string;
  description: string | null;
  thumb: string | null;
  preview: string | null;
  ownerId: string;
  owner: RecipeOwner;
}

export interface RecipeSummary extends RecipeCardData {
  instructions: string;
  time: number | null;
  categoryId: string;
  category: RecipeLookup;
  areaId: string | null;
  area: RecipeLookup | null;
  createdAt: string;
  updatedAt: string;
}

export interface RecipesResponse {
  data: RecipeSummary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RecipesQuery {
  category?: string;
  area?: string;
  ingredient?: string;
  page?: number;
  limit?: number;
}
