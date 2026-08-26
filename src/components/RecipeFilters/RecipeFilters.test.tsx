import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { RecipeFilters } from "./RecipeFilters.tsx";

const ingredients = [
  { id: "ingredient-almonds", name: "Almonds" },
  { id: "ingredient-salmon", name: "Salmon" },
];

const areas = [
  { id: "area-ukrainian", name: "Ukrainian" },
  { id: "area-british", name: "British" },
];

describe("RecipeFilters", () => {
  it("renders ingredient and area options", () => {
    render(
      <RecipeFilters
        ingredients={ingredients}
        areas={areas}
        ingredient=""
        area=""
        onIngredientChange={vi.fn()}
        onAreaChange={vi.fn()}
      />,
    );

    expect(screen.getByRole("option", { name: "Almonds" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Ukrainian" })).toBeInTheDocument();
  });

  it("reports selected filter values", () => {
    const onIngredientChange = vi.fn();
    const onAreaChange = vi.fn();

    render(
      <RecipeFilters
        ingredients={ingredients}
        areas={areas}
        ingredient=""
        area=""
        onIngredientChange={onIngredientChange}
        onAreaChange={onAreaChange}
      />,
    );

    fireEvent.change(
      screen.getByRole("combobox", {
        name: "Filter by ingredients",
      }),
      {
        target: { value: "ingredient-almonds" },
      },
    );

    fireEvent.change(
      screen.getByRole("combobox", {
        name: "Filter by area",
      }),
      {
        target: { value: "area-ukrainian" },
      },
    );

    expect(onIngredientChange).toHaveBeenCalledWith("ingredient-almonds");
    expect(onAreaChange).toHaveBeenCalledWith("area-ukrainian");
  });

  it("disables both filters when loading", () => {
    render(
      <RecipeFilters
        ingredients={ingredients}
        areas={areas}
        ingredient=""
        area=""
        disabled
        onIngredientChange={vi.fn()}
        onAreaChange={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("combobox", {
        name: "Filter by ingredients",
      }),
    ).toBeDisabled();

    expect(
      screen.getByRole("combobox", {
        name: "Filter by area",
      }),
    ).toBeDisabled();
  });
});
