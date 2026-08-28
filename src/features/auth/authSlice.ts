import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  ApiError,
  apiRequest,
  getAccessToken,
  setAccessToken,
} from "../../lib/apiClient.ts";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
}

// GET /users/me returns the user plus aggregate counts.
interface UserProfile extends User {
  recipesCount: number;
  favoritesCount: number;
  followersCount: number;
  followingCount: number;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  status: "idle" | "loading";
  /** True once the initial silent-refresh check has resolved. */
  bootstrapped: boolean;
}

const USER_KEY = "foodies.user";

function loadUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function persistUser(user: User | null): void {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(USER_KEY);
}

const initialState: AuthState = {
  // Optimistically show the persisted user; bootstrap() confirms or clears it.
  user: loadUser(),
  isAuthenticated: false,
  status: "idle",
  bootstrapped: false,
};

const toUser = (u: User): User => ({
  id: u.id,
  name: u.name,
  email: u.email,
  avatar: u.avatar,
});

export const register = createAsyncThunk(
  "auth/register",
  async (input: RegisterInput, { rejectWithValue }) => {
    try {
      const data = await apiRequest<{ user: User; accessToken: string }>(
        "/auth/register",
        { method: "POST", body: input },
      );
      setAccessToken(data.accessToken);
      const user = toUser(data.user);
      persistUser(user);
      return user;
    } catch (err) {
      return rejectWithValue(
        err instanceof ApiError ? err.message : "Registration failed",
      );
    }
  },
);

export const login = createAsyncThunk(
  "auth/login",
  async (input: LoginInput, { rejectWithValue }) => {
    try {
      const data = await apiRequest<{ user: User; accessToken: string }>("/auth/login", {
        method: "POST",
        body: input,
      });
      setAccessToken(data.accessToken);
      const user = toUser(data.user);
      persistUser(user);
      return user;
    } catch (err) {
      return rejectWithValue(err instanceof ApiError ? err.message : "Login failed");
    }
  },
);

export const fetchMe = createAsyncThunk("auth/fetchMe", async () => {
  const data = await apiRequest<UserProfile>("/users/me", { auth: true });
  const user = toUser(data);
  persistUser(user);
  return user;
});

// Log out on the server (best-effort), then always clear the client session.
export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    await apiRequest("/auth/logout", { method: "POST", auth: true });
  } catch {
    // Ignore — the ТЗ requires client-side logout regardless of the response.
  }
  setAccessToken(null);
  persistUser(null);
});

// Runs once on app mount: validate the session via /users/me. apiRequest will
// silently refresh using the httpOnly cookie, so a valid cookie re-authenticates
// even when the access token expired. A true guest has no persisted token/user,
// so we skip the probe entirely — otherwise every public visit would fire (and
// the browser would log) a 401 for /users/me + /auth/refresh.
// even when no access token survived the reload.
export const bootstrap = createAsyncThunk("auth/bootstrap", async (_, { dispatch }) => {
  if (!getAccessToken() && !loadUser()) return;

  try {
    await dispatch(fetchMe()).unwrap();
  } catch {
    setAccessToken(null);
    persistUser(null);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Called by the apiClient auth-failure handler (refresh gave up).
    forceLogout(state) {
      state.user = null;
      state.isAuthenticated = false;
      setAccessToken(null);
      persistUser(null);
    },
    // Оновлює аватар в auth.user після успішного завантаження нового фото
    updateUserAvatar(state, action: { payload: string }) {
      if (state.user) {
        state.user.avatar = action.payload;
        persistUser(state.user); // Оновлюємо localStorage теж
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(bootstrap.pending, (state) => {
        state.status = "loading";
      })
      .addCase(bootstrap.fulfilled, (state) => {
        state.status = "idle";
        state.bootstrapped = true;
      })
      .addCase(bootstrap.rejected, (state) => {
        state.status = "idle";
        state.bootstrapped = true;
      });
  },
});

export const { forceLogout, updateUserAvatar } = authSlice.actions;
export default authSlice.reducer;
