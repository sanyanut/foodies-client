import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// main API URL for the backend server
const API_URL = "http://localhost:3000";

// Інтерфейси для типізації
export interface Ingredient {
  id: number;
  name: string;
  amount: string;
}

export interface Recipe {
  id: string;
  title: string;
  categoryName: string;
  areaName: string;
  instructions: string;
  description: string;
  thumb?: string;
  preview?: string | null;
  time: number;
  ownerId: string;
}
interface RecipesState {
  currentRecipe: Recipe | null;
  popularRecipes: Recipe[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: RecipesState = {
  currentRecipe: null,
  popularRecipes: [],
  status: "idle",
  error: null,
};

// async request to fetch a recipe by ID (GET /recipes/:id)
export const fetchRecipeById = createAsyncThunk<Recipe, string, { rejectValue: string }>(
  "recipes/fetchRecipeById",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/recipes/${id}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message || "Failed to fetch recipe",
        );
      }
      return thunkAPI.rejectWithValue("An unexpected error occurred");
    }
  },
);

// async request to fetch popular recipes (GET /recipes/popular)
export const fetchPopularRecipes = createAsyncThunk<
  Recipe[],
  void,
  { rejectValue: string }
>("recipes/fetchPopularRecipes", async (_, thunkAPI) => {
  try {
    const response = await axios.get(`${API_URL}/recipes/popular`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch popular recipes",
      );
    }
    return thunkAPI.rejectWithValue("An unexpected error occurred");
  }
});

const recipeSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Recipe by ID
      .addCase(fetchRecipeById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchRecipeById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentRecipe = action.payload;
      })
      .addCase(fetchRecipeById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch recipe";
      })
      // Fetch Popular Recipes
      .addCase(fetchPopularRecipes.fulfilled, (state, action) => {
        state.popularRecipes = action.payload;
      });
  },
});

export default recipeSlice.reducer;
