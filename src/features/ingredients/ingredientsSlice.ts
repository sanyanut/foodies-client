import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { ApiError, apiRequest } from "../../lib/apiClient.ts";

export interface Ingredient {
  id: string;
  name: string;
  description: string;
  img: string;
}

interface IngredientsState {
  items: Ingredient[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: IngredientsState = {
  items: [],
  status: "idle",
  error: null,
};

// GET /ingredients is a public endpoint — no auth required.
export const fetchIngredients = createAsyncThunk(
  "ingredients/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await apiRequest<Ingredient[]>("/ingredients");
    } catch (err) {
      return rejectWithValue(
        err instanceof ApiError ? err.message : "Failed to fetch ingredients",
      );
    }
  },
);

const ingredientsSlice = createSlice({
  name: "ingredients",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Failed to fetch ingredients";
      });
  },
});

export default ingredientsSlice.reducer;
