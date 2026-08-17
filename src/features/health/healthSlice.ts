import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

type ConnectionStatus = "idle" | "loading" | "up" | "down";

interface HealthState {
  status: ConnectionStatus;
  lastCheckedAt: string | null;
}

const initialState: HealthState = {
  status: "idle",
  lastCheckedAt: null,
};

// Example Redux Toolkit async thunk: pings the backend health endpoint. Shows
// the wiring (thunk + slice + typed store) that future data fetching will use.
export const pingBackend = createAsyncThunk("health/ping", async () => {
  const res = await fetch(`${API_URL}/health`);
  if (!res.ok) throw new Error(`Backend responded ${res.status}`);
  return (await res.json()) as { status: string };
});

const healthSlice = createSlice({
  name: "health",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(pingBackend.pending, (state) => {
        state.status = "loading";
      })
      .addCase(pingBackend.fulfilled, (state) => {
        state.status = "up";
        state.lastCheckedAt = new Date().toISOString();
      })
      .addCase(pingBackend.rejected, (state) => {
        state.status = "down";
        state.lastCheckedAt = new Date().toISOString();
      });
  },
});

export default healthSlice.reducer;
