import { configureStore } from "@reduxjs/toolkit";

import healthReducer from "../features/health/healthSlice.ts";
import recipeReducer from "../features/recipes/recipeSlice.ts";

// Central Redux store. Feature slices are registered here as the app grows.
// Redux Toolkit wires up thunk middleware and the Redux DevTools by default.
export const store = configureStore({
  reducer: {
    health: healthReducer,
    recipes: recipeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
