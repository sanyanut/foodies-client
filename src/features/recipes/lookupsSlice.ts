import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getAreas, getCategories, getIngredients } from "./recipesApi.ts";
import type { RecipeLookup } from "./types.ts";

// Ingredients / areas / categories change rarely, so they're fetched once and
// cached in the store for reuse (ТЗ: keep the filter lookups in redux to avoid
// re-requesting them). `fetchLookups` is a no-op once the data is loaded.
interface LookupsState {
  categories: RecipeLookup[];
  ingredients: RecipeLookup[];
  areas: RecipeLookup[];
  status: "idle" | "loading" | "ready" | "error";
  error: string | null;
}

const initialState: LookupsState = {
  categories: [],
  ingredients: [],
  areas: [],
  status: "idle",
  error: null,
};

export const fetchLookups = createAsyncThunk(
  "lookups/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const [categories, ingredients, areas] = await Promise.all([
        getCategories(),
        getIngredients(),
        getAreas(),
      ]);
      return { categories, ingredients, areas };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to load recipe filters",
      );
    }
  },
  {
    // Skip the request when the lookups are already loading or loaded.
    condition: (_, { getState }) => {
      const { status } = (getState() as { lookups: LookupsState }).lookups;
      return status === "idle" || status === "error";
    },
  },
);

const lookupsSlice = createSlice({
  name: "lookups",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLookups.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchLookups.fulfilled, (state, action) => {
        state.categories = action.payload.categories;
        state.ingredients = action.payload.ingredients;
        state.areas = action.payload.areas;
        state.status = "ready";
      })
      .addCase(fetchLookups.rejected, (state, action) => {
        state.status = "error";
        state.error = (action.payload as string) ?? "Failed to load recipe filters";
      });
  },
});

export default lookupsSlice.reducer;
