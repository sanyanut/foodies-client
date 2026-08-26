import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

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

describe("RecipeCard", () => {
  it("renders the recipe information and details link", () => {
    render(
      <MemoryRouter>
        <RecipeCard recipe={recipe} />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("img", {
        name: "Bakewell Tart",
      }),
    ).toHaveAttribute("src", recipe.thumb);

    expect(screen.getByText("Bakewell Tart")).toBeInTheDocument();
    expect(screen.getByText("GoIT")).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "Open Bakewell Tart",
      }),
    ).toHaveAttribute("href", "/recipes/recipe-1");
  });

  it("calls onFavoriteToggle with the recipe id", () => {
    const onFavoriteToggle = vi.fn();

    render(
      <MemoryRouter>
        <RecipeCard recipe={recipe} onFavoriteToggle={onFavoriteToggle} />
      </MemoryRouter>,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Add Bakewell Tart to favorites",
      }),
    );

    expect(onFavoriteToggle).toHaveBeenCalledTimes(1);
    expect(onFavoriteToggle).toHaveBeenCalledWith("recipe-1");
  });

  it("renders fallbacks when the recipe has no image or owner avatar", () => {
    render(
      <MemoryRouter>
        <RecipeCard
          recipe={{
            ...recipe,
            thumb: null,
            preview: null,
          }}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText("No image")).toBeInTheDocument();
    expect(screen.getByText("G")).toBeInTheDocument();
  });
});
