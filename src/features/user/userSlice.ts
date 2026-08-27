import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { apiRequest, ApiError } from "../../lib/apiClient.ts";

// Інтерфейс для МОГО профілю (більше полів)
export interface MyProfile {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  recipesCount: number;
  favoritesCount: number;
  followersCount: number;
  followingCount: number;
}

// Інтерфейс для ПУБЛІЧНОГО профілю (менше полів, але є isFollowedByMe)
export interface PublicProfile {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  recipesCount: number;
  followersCount: number;
  isFollowedByMe: boolean;
}

interface UserState {
  // Зберігаємо той профіль, який зараз відкритий на сторінці
  viewedProfile: MyProfile | PublicProfile | null;
  isMyProfile: boolean; // Зручний прапорець, щоб знати, чия це сторінка
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UserState = {
  viewedProfile: null,
  isMyProfile: false,
  status: "idle",
  error: null,
};

// Запит для свого профілю
export const fetchMyProfile = createAsyncThunk(
  "user/fetchMyProfile",
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiRequest<MyProfile>("/users/me", { auth: true });
      return data;
    } catch (err) {
      return rejectWithValue(
        err instanceof ApiError ? err.message : "Failed to fetch my profile",
      );
    }
  },
);

// Запит для чужого профілю
export const fetchPublicProfile = createAsyncThunk(
  "user/fetchPublicProfile",
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await apiRequest<PublicProfile>(`/users/${id}`, { auth: true });
      return data;
    } catch (err) {
      return rejectWithValue(
        err instanceof ApiError ? err.message : "Failed to fetch public profile",
      );
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearViewedProfile(state) {
      state.viewedProfile = null;
      state.isMyProfile = false;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // --- Обробка fetchMyProfile ---
    builder
      .addCase(fetchMyProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMyProfile.fulfilled, (state, action: PayloadAction<MyProfile>) => {
        state.status = "succeeded";
        state.viewedProfile = action.payload;
        state.isMyProfile = true; // Це точно мій профіль
      })
      .addCase(fetchMyProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // --- Обробка fetchPublicProfile ---
    builder
      .addCase(fetchPublicProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchPublicProfile.fulfilled,
        (state, action: PayloadAction<PublicProfile>) => {
          state.status = "succeeded";
          state.viewedProfile = action.payload;
          state.isMyProfile = false; // Це публічний профіль
        },
      )
      .addCase(fetchPublicProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { clearViewedProfile } = userSlice.actions;
export default userSlice.reducer;
