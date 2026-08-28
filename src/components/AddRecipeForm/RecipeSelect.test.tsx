import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { RecipeSelect } from "./RecipeSelect.tsx";

const options = [
  { id: "1", name: "Beef" },
  { id: "2", name: "Chicken" },
  { id: "3", name: "Pork" },
];

const renderSelect = (props = {}) =>
  render(
    <RecipeSelect
      placeholder="Select a category"
      options={options}
      value=""
      onChange={vi.fn()}
      {...props}
    />,
  );

describe("RecipeSelect", () => {
  it("filters options as the user types", () => {
    renderSelect();

    fireEvent.click(screen.getByRole("button", { name: "Select a category" }));
    expect(screen.getByRole("button", { name: "Beef" })).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: "chi" },
    });

    expect(screen.getByRole("button", { name: "Chicken" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Beef" })).not.toBeInTheDocument();
  });

  it("reports the selected option", () => {
    const onChange = vi.fn();
    renderSelect({ onChange });

    fireEvent.click(screen.getByRole("button", { name: "Select a category" }));
    fireEvent.click(screen.getByRole("button", { name: "Pork" }));

    expect(onChange).toHaveBeenCalledWith({ id: "3", name: "Pork" });
  });
});
