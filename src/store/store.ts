import { configureStore } from "@reduxjs/toolkit";

import healthReducer from "../features/health/healthSlice.ts";
import authReducer from "../features/auth/authSlice.ts";
import modalReducer from "../features/ui/modalSlice.ts";
import ingredientsReducer from "../features/ingredients/ingredientsSlice.ts";
import areasReducer from "../features/areas/areasSlice.ts";
import lookupsReducer from "../features/recipes/lookupsSlice.ts";
import favoritesReducer from "../features/recipes/favoritesSlice.ts";

// Central Redux store. Feature slices are registered here as the app grows.
// Redux Toolkit wires up thunk middleware and the Redux DevTools by default.
export const store = configureStore({
  reducer: {
    health: healthReducer,
    auth: authReducer,
    modal: modalReducer,
    ingredients: ingredientsReducer,
    areas: areasReducer,
    lookups: lookupsReducer,
    favorites: favoritesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
