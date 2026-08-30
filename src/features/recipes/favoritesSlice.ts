import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { ApiError, apiRequest } from "../../lib/apiClient.ts";
import { forceLogout, logout } from "../auth/authSlice.ts";
import type { RecipesResponse } from "./types.ts";

// Tracks the ids of the current user's favorite recipes so RecipeCard can show
// the accent heart. Seeded from GET /recipes/favorites and kept in sync on
// toggle. (The recipes list has no per-item isFavorite flag, so the accent is
// reliable for favorites on the first page + anything toggled this session.)
//
// Status pattern mirrors userSlice.ts: `status` covers the list fetch,
// `togglingId` is a per-item flag (like userSlice's separate `avatarStatus`)
// so toggling one card's heart doesn't disable every other card's.
interface FavoritesState {
  ids: string[];
  loaded: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  togglingId: string | null;
}

const initialState: FavoritesState = {
  ids: [],
  loaded: false,
  status: "idle",
  error: null,
  togglingId: null,
};

export const fetchFavorites = createAsyncThunk(
  "favorites/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiRequest<RecipesResponse>("/recipes/favorites", {
        auth: true,
      });
      return data.data.map((recipe) => recipe.id);
    } catch (error) {
      return rejectWithValue(
        error instanceof ApiError ? error.message : "Failed to load favorites",
      );
    }
  },
);

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
      .addCase(fetchFavorites.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.ids = action.payload;
        state.loaded = true;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(toggleFavorite.pending, (state, action) => {
        state.togglingId = action.meta.arg;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        state.togglingId = null;
        const { recipeId, isFavorite } = action.payload;
        if (isFavorite) {
          if (!state.ids.includes(recipeId)) state.ids.push(recipeId);
        } else {
          state.ids = state.ids.filter((id) => id !== recipeId);
        }
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        state.togglingId = null;
        state.error = action.payload as string;
      })
      // Clear on logout so the next user doesn't inherit these.
      .addCase(logout.fulfilled, (state) => {
        state.ids = [];
        state.loaded = false;
        state.status = "idle";
      })
      .addCase(forceLogout, (state) => {
        state.ids = [];
        state.loaded = false;
        state.status = "idle";
      });
  },
});

export default favoritesSlice.reducer;
