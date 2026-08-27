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

interface State {
  areas: AreasState;
}

// GET /areas is a public endpoint — no auth required. Areas are a static
// dictionary, so once a fetch has succeeded (or is in flight) further
// dispatches are skipped and the cached `items` are reused instead of
// re-requesting the list on every mount.
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
  {
    condition: (_, { getState }) => {
      const { status } = (getState() as State).areas;
      return status !== "loading" && status !== "succeeded";
    },
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

export const selectAreas = (state: State): Area[] => state.areas.items;
export const selectAreasStatus = (state: State): AreasState["status"] =>
  state.areas.status;

export default areasSlice.reducer;
