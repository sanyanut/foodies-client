import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { ApiError, apiRequest } from "../../lib/apiClient.ts";

export interface Area {
  id: string;
  name: string;
}

interface AreasState {
  items: Area[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AreasState = {
  items: [],
  status: "idle",
  error: null,
};

// GET /areas is a public endpoint — no auth required.
export const fetchAreas = createAsyncThunk(
  "areas/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await apiRequest<Area[]>("/areas");
    } catch (err) {
      return rejectWithValue(
        err instanceof ApiError ? err.message : "Failed to fetch areas",
      );
    }
  },
);

const areasSlice = createSlice({
  name: "areas",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAreas.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAreas.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchAreas.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Failed to fetch areas";
      });
  },
});

export default areasSlice.reducer;
