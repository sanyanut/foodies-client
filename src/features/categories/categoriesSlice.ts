import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { ApiError, apiRequest } from "../../lib/apiClient.ts";

export interface Category {
  id: string;
  name: string;
}

interface CategoriesState {
  items: Category[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CategoriesState = {
  items: [],
  status: "idle",
  error: null,
};

interface State {
  categories: CategoriesState;
}

// GET /categories is a public endpoint — no auth required. Categories are a
// static dictionary, so once a fetch has succeeded (or is in flight) further
// dispatches are skipped and the cached `items` are reused instead of
// re-requesting the list on every mount.
export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await apiRequest<Category[]>("/categories");
    } catch (err) {
      return rejectWithValue(
        err instanceof ApiError ? err.message : "Failed to fetch categories",
      );
    }
  },
  {
    condition: (_, { getState }) => {
      const { status } = (getState() as State).categories;
      return status !== "loading" && status !== "succeeded";
    },
  },
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Failed to fetch categories";
      });
  },
});

export const selectCategories = (state: State): Category[] => state.categories.items;
export const selectCategoriesStatus = (state: State): CategoriesState["status"] =>
  state.categories.status;

export default categoriesSlice.reducer;
