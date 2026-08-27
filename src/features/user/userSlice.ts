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

export interface TabRecipeItem {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  thumb?: string;
}

export interface TabUserItem {
  id: string;
  name: string;
  email?: string;
  avatar?: string | null;
  recipesCount?: number;
  isFollowedByMe: boolean;
  recipes?: Array<{ id: string; thumb: string; title: string }>;
}

interface UserState {
  viewedProfile: MyProfile | PublicProfile | null;
  isMyProfile: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  avatarStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;

  // Дані вкладок профілю
  tabRecipes: TabRecipeItem[];
  tabUsers: TabUserItem[];
  tabCurrentPage: number;
  tabTotalPages: number;
  tabStatus: "idle" | "loading" | "succeeded" | "failed";
  tabError: string | null;
}

const initialState: UserState = {
  viewedProfile: null,
  isMyProfile: false,
  status: "idle",
  avatarStatus: "idle",
  error: null,

  tabRecipes: [],
  tabUsers: [],
  tabCurrentPage: 1,
  tabTotalPages: 1,
  tabStatus: "idle",
  tabError: null,
};

// ─── Async Thunks ────────────────────────────────────────────────────────────

export const fetchMyProfile = createAsyncThunk(
  "user/fetchMyProfile",
  async (_, { rejectWithValue }) => {
    try {
      return await apiRequest<MyProfile>("/users/me", { auth: true });
    } catch (err) {
      return rejectWithValue(
        err instanceof ApiError ? err.message : "Failed to fetch my profile",
      );
    }
  },
);

export const fetchPublicProfile = createAsyncThunk(
  "user/fetchPublicProfile",
  async (id: string, { rejectWithValue }) => {
    try {
      return await apiRequest<PublicProfile>(`/users/${id}`, { auth: true });
    } catch (err) {
      return rejectWithValue(
        err instanceof ApiError ? err.message : "Failed to fetch public profile",
      );
    }
  },
);

export const fetchTabRecipes = createAsyncThunk(
  "user/fetchTabRecipes",
  async (
    { endpoint, page, limit = 9 }: { endpoint: string; page: number; limit?: number },
    { rejectWithValue },
  ) => {
    try {
      const res = await apiRequest<
        | {
            data?: TabRecipeItem[];
            recipes?: TabRecipeItem[];
            items?: TabRecipeItem[];
            totalPages?: number;
          }
        | TabRecipeItem[]
      >(`${endpoint}?page=${page}&limit=${limit}`, { auth: true });

      if (Array.isArray(res)) {
        return { recipes: res, totalPages: 1, page };
      }
      const list = res.data ?? res.items ?? res.recipes ?? [];
      return { recipes: list, totalPages: res.totalPages ?? 1, page };
    } catch (err) {
      return rejectWithValue(
        err instanceof ApiError ? err.message : "Failed to fetch recipes",
      );
    }
  },
);

export const fetchTabUsers = createAsyncThunk(
  "user/fetchTabUsers",
  async (
    { endpoint, page, limit = 5 }: { endpoint: string; page: number; limit?: number },
    { rejectWithValue },
  ) => {
    try {
      const res = await apiRequest<
        | { users?: TabUserItem[]; data?: TabUserItem[]; totalPages?: number }
        | TabUserItem[]
      >(`${endpoint}?page=${page}&limit=${limit}`, { auth: true });

      if (Array.isArray(res)) {
        return { users: res, totalPages: 1, page };
      }
      const list = res.users ?? res.data ?? [];
      return { users: list, totalPages: res.totalPages ?? 1, page };
    } catch (err) {
      return rejectWithValue(
        err instanceof ApiError ? err.message : "Failed to fetch users",
      );
    }
  },
);

export const deleteTabRecipe = createAsyncThunk(
  "user/deleteTabRecipe",
  async (
    { recipeId, isFavorite }: { recipeId: string; isFavorite: boolean },
    { rejectWithValue },
  ) => {
    try {
      const path = isFavorite ? `/recipes/${recipeId}/favorite` : `/recipes/${recipeId}`;
      await apiRequest(path, { method: "DELETE", auth: true });
      return { recipeId, isFavorite };
    } catch (err) {
      return rejectWithValue(
        err instanceof ApiError ? err.message : "Failed to delete recipe",
      );
    }
  },
);

export const toggleFollowUser = createAsyncThunk(
  "user/toggleFollowUser",
  async (
    {
      targetUserId,
      isFollowed,
      isFollowingTab,
    }: {
      targetUserId: string;
      isFollowed: boolean;
      isFollowingTab: boolean;
    },
    { rejectWithValue },
  ) => {
    try {
      await apiRequest(`/users/${targetUserId}/follow`, {
        method: isFollowed ? "DELETE" : "POST",
        auth: true,
      });
      // isFollowed — поточний стан ДО запиту; повертаємо новий стан
      return { targetUserId, nowFollowed: !isFollowed, isFollowingTab };
    } catch (err) {
      return rejectWithValue(
        err instanceof ApiError ? err.message : "Failed to toggle follow",
      );
    }
  },
);

export const updateAvatar = createAsyncThunk(
  "user/updateAvatar",
  async (file: File, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const data = await apiRequest<{ avatarUrl: string }>("/users/me/avatar", {
        method: "PATCH",
        auth: true,
        body: formData,
      });
      return data.avatarUrl;
    } catch (err) {
      return rejectWithValue(
        err instanceof ApiError ? err.message : "Failed to update avatar",
      );
    }
  },
);

// ─── Slice ───────────────────────────────────────────────────────────────────

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
    clearTabData(state) {
      state.tabRecipes = [];
      state.tabUsers = [];
      state.tabCurrentPage = 1;
      state.tabTotalPages = 1;
      state.tabStatus = "idle";
      state.tabError = null;
    },
    setTabCurrentPage(state, action: PayloadAction<number>) {
      state.tabCurrentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    // --- fetchMyProfile ---
    builder
      .addCase(fetchMyProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMyProfile.fulfilled, (state, action: PayloadAction<MyProfile>) => {
        state.status = "succeeded";
        state.viewedProfile = action.payload;
        state.isMyProfile = true;
      })
      .addCase(fetchMyProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // --- fetchPublicProfile ---
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
          state.isMyProfile = false;
        },
      )
      .addCase(fetchPublicProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    // --- updateAvatar ---
    builder
      .addCase(updateAvatar.pending, (state) => {
        state.avatarStatus = "loading";
      })
      .addCase(updateAvatar.fulfilled, (state, action: PayloadAction<string>) => {
        state.avatarStatus = "succeeded";
        if (state.viewedProfile) {
          state.viewedProfile.avatar = action.payload;
        }
      })
      .addCase(updateAvatar.rejected, (state) => {
        state.avatarStatus = "failed";
      });

    // --- fetchTabRecipes ---
    builder
      .addCase(fetchTabRecipes.pending, (state) => {
        state.tabStatus = "loading";
        state.tabError = null;
        // Очищаємо старі дані одразу, щоб не блимало
        state.tabRecipes = [];
        state.tabTotalPages = 1;
      })
      .addCase(fetchTabRecipes.fulfilled, (state, action) => {
        state.tabStatus = "succeeded";
        state.tabRecipes = action.payload.recipes;
        state.tabTotalPages = action.payload.totalPages;
        state.tabCurrentPage = action.payload.page;
      })
      .addCase(fetchTabRecipes.rejected, (state, action) => {
        state.tabStatus = "failed";
        state.tabError = action.payload as string;
      });

    // --- fetchTabUsers ---
    builder
      .addCase(fetchTabUsers.pending, (state) => {
        state.tabStatus = "loading";
        state.tabError = null;
        // Очищаємо старі дані одразу, щоб не блимало
        state.tabUsers = [];
        state.tabTotalPages = 1;
      })
      .addCase(fetchTabUsers.fulfilled, (state, action) => {
        state.tabStatus = "succeeded";
        state.tabUsers = action.payload.users;
        state.tabTotalPages = action.payload.totalPages;
        state.tabCurrentPage = action.payload.page;
      })
      .addCase(fetchTabUsers.rejected, (state, action) => {
        state.tabStatus = "failed";
        state.tabError = action.payload as string;
      });

    // --- deleteTabRecipe ---
    builder.addCase(deleteTabRecipe.fulfilled, (state, action) => {
      const { recipeId, isFavorite } = action.payload;
      state.tabRecipes = state.tabRecipes.filter((r) => (r.id ?? r._id) !== recipeId);
      if (state.viewedProfile) {
        if (isFavorite && "favoritesCount" in state.viewedProfile) {
          state.viewedProfile.favoritesCount = Math.max(
            0,
            state.viewedProfile.favoritesCount - 1,
          );
        } else if (!isFavorite && "recipesCount" in state.viewedProfile) {
          state.viewedProfile.recipesCount = Math.max(
            0,
            state.viewedProfile.recipesCount - 1,
          );
        }
      }
    });

    // --- toggleFollowUser ---
    builder.addCase(toggleFollowUser.fulfilled, (state, action) => {
      const { targetUserId, nowFollowed, isFollowingTab } = action.payload;

      // 1. Кнопка на сторінці чужого профілю (Follow/Unfollow для самого профілю)
      if (state.viewedProfile && state.viewedProfile.id === targetUserId) {
        if ("isFollowedByMe" in state.viewedProfile) {
          state.viewedProfile.isFollowedByMe = nowFollowed;
        }
        state.viewedProfile.followersCount = Math.max(
          0,
          state.viewedProfile.followersCount + (nowFollowed ? 1 : -1),
        );
      }

      // 2. На СВОЄМУ профілі — змінюємо followingCount
      //    (відписка/підписка на когось зі списку followers/following)
      if (
        state.isMyProfile &&
        state.viewedProfile &&
        "followingCount" in state.viewedProfile
      ) {
        state.viewedProfile.followingCount = Math.max(
          0,
          state.viewedProfile.followingCount + (nowFollowed ? 1 : -1),
        );
      }

      // 3. Оновлюємо статус у списку
      if (isFollowingTab && !nowFollowed) {
        // Відписались у вкладці Following — видаляємо з списку
        state.tabUsers = state.tabUsers.filter((u) => u.id !== targetUserId);
      } else {
        // Оновлюємо isFollowedByMe для конкретного юзера у списку
        state.tabUsers = state.tabUsers.map((u) =>
          u.id === targetUserId ? { ...u, isFollowedByMe: nowFollowed } : u,
        );
      }
    });
  },
});

export const { clearViewedProfile, clearTabData, setTabCurrentPage } = userSlice.actions;
export default userSlice.reducer;
