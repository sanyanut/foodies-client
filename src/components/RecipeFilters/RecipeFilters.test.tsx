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

const renderFilters = (props = {}) =>
  render(
    <RecipeFilters
      ingredients={ingredients}
      areas={areas}
      ingredient=""
      area=""
      onIngredientChange={vi.fn()}
      onAreaChange={vi.fn()}
      {...props}
    />,
  );

describe("RecipeFilters", () => {
  it("shows the options when a dropdown is opened", () => {
    renderFilters();

    fireEvent.click(screen.getByRole("button", { name: "Filter by ingredients" }));
    expect(screen.getByRole("option", { name: "Almonds" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Filter by area" }));
    expect(screen.getByRole("option", { name: "Ukrainian" })).toBeInTheDocument();
  });

  it("reports the selected option value", () => {
    const onIngredientChange = vi.fn();
    renderFilters({ onIngredientChange });

    fireEvent.click(screen.getByRole("button", { name: "Filter by ingredients" }));
    fireEvent.click(screen.getByRole("option", { name: "Almonds" }));

    expect(onIngredientChange).toHaveBeenCalledWith("ingredient-almonds");
  });

  it("filters options as the user types", () => {
    renderFilters();

    fireEvent.click(screen.getByRole("button", { name: "Filter by ingredients" }));
    fireEvent.change(screen.getByPlaceholderText(/search ingredients/i), {
      target: { value: "salm" },
    });

    expect(screen.getByRole("option", { name: "Salmon" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Almonds" })).not.toBeInTheDocument();
  });

  it("disables both filters when loading", () => {
    renderFilters({ disabled: true });

    expect(screen.getByRole("button", { name: "Filter by ingredients" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Filter by area" })).toBeDisabled();
  });
});
