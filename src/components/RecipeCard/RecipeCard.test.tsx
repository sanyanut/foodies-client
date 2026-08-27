import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { describe, expect, it } from "vitest";

import authReducer from "../../features/auth/authSlice.ts";
import modalReducer from "../../features/ui/modalSlice.ts";
import favoritesReducer from "../../features/recipes/favoritesSlice.ts";
import type { RecipeCardData } from "../../features/recipes/types.ts";
import { RecipeCard } from "./RecipeCard.tsx";

const recipe: RecipeCardData = {
  id: "recipe-1",
  title: "Bakewell Tart",
  description: "A British dessert with a shortcrust pastry shell.",
  thumb: "https://example.com/bakewell-tart.jpg",
  preview: null,
  ownerId: "owner-1",
  owner: {
    name: "GoIT",
    avatar: null,
  },
};

function makeStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      modal: modalReducer,
      favorites: favoritesReducer,
    },
  });
}

function renderCard(recipeData: RecipeCardData = recipe) {
  const store = makeStore();
  render(
    <Provider store={store}>
      <MemoryRouter>
        <RecipeCard recipe={recipeData} />
      </MemoryRouter>
    </Provider>,
  );
  return store;
}

describe("RecipeCard", () => {
  it("renders the recipe information and details link", () => {
    renderCard();

    expect(screen.getByRole("img", { name: "Bakewell Tart" })).toHaveAttribute(
      "src",
      recipe.thumb,
    );
    expect(screen.getByText("Bakewell Tart")).toBeInTheDocument();
    expect(screen.getByText("GoIT")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open Bakewell Tart" })).toHaveAttribute(
      "href",
      "/recipes/recipe-1",
    );
  });

  it("opens the Sign In modal when a guest clicks the favorite heart", () => {
    const store = renderCard();

    fireEvent.click(
      screen.getByRole("button", { name: "Add Bakewell Tart to favorites" }),
    );

    expect(store.getState().modal.activeModal).toBe("signin");
  });

  it("opens the Sign In modal when a guest clicks the author", () => {
    const store = renderCard();

    fireEvent.click(screen.getByRole("button", { name: "View GoIT's profile" }));

    expect(store.getState().modal.activeModal).toBe("signin");
  });

  it("renders fallbacks when the recipe has no image or owner avatar", () => {
    renderCard({ ...recipe, thumb: null, preview: null });

    expect(screen.getByText("No image")).toBeInTheDocument();
    expect(screen.getByText("G")).toBeInTheDocument();
  });
});
