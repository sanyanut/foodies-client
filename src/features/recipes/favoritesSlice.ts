import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { apiRequest } from "../../lib/apiClient.ts";
import { forceLogout, logout } from "../auth/authSlice.ts";
import type { RecipesResponse } from "./types.ts";

// Tracks the ids of the current user's favorite recipes so RecipeCard can show
// the accent heart. Seeded from GET /recipes/favorites and kept in sync on
// toggle. (The recipes list has no per-item isFavorite flag, so the accent is
// reliable for favorites on the first page + anything toggled this session.)
interface FavoritesState {
  ids: string[];
  loaded: boolean;
}

const initialState: FavoritesState = {
  ids: [],
  loaded: false,
};

export const fetchFavorites = createAsyncThunk("favorites/fetch", async () => {
  const data = await apiRequest<RecipesResponse>("/recipes/favorites", { auth: true });
  return data.data.map((recipe) => recipe.id);
});

export const toggleFavorite = createAsyncThunk(
  "favorites/toggle",
  async (recipeId: string, { getState, rejectWithValue }) => {
    const isFavorite = (
      getState() as { favorites: FavoritesState }
    ).favorites.ids.includes(recipeId);
    try {
      await apiRequest(`/recipes/${recipeId}/favorite`, {
        method: isFavorite ? "DELETE" : "POST",
        auth: true,
      });
      return { recipeId, isFavorite: !isFavorite };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to update favorites",
      );
    }
  },
);

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.ids = action.payload;
        state.loaded = true;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const { recipeId, isFavorite } = action.payload;
        if (isFavorite) {
          if (!state.ids.includes(recipeId)) state.ids.push(recipeId);
        } else {
          state.ids = state.ids.filter((id) => id !== recipeId);
        }
      })
      // Clear on logout so the next user doesn't inherit these.
      .addCase(logout.fulfilled, (state) => {
        state.ids = [];
        state.loaded = false;
      })
      .addCase(forceLogout, (state) => {
        state.ids = [];
        state.loaded = false;
      });
  },
});

export default favoritesSlice.reducer;
