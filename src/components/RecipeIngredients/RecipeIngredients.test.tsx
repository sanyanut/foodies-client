import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RecipeIngredients } from "./RecipeIngredients.tsx";

describe("RecipeIngredients image fallback", () => {
  it("shows an initial-letter placeholder when an ingredient has no image", () => {
    render(
      <RecipeIngredients ingredients={[{ id: "1", name: "Salmon", amount: "400 g" }]} />,
    );

    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.getByText("S")).toBeInTheDocument();
  });

  it("falls back to the placeholder when the image fails to load", () => {
    render(
      <RecipeIngredients
        ingredients={[
          {
            id: "1",
            name: "Avocado",
            amount: "3",
            img: "https://example.com/broken.png",
          },
        ]}
      />,
    );

    fireEvent.error(screen.getByRole("img"));

    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.getByText("A")).toBeInTheDocument();
  });
});
