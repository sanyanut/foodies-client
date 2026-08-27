import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { RecipePagination } from "./RecipePagination.tsx";

describe("RecipePagination", () => {
  it("does not render when there is only one page", () => {
    const { container } = render(
      <RecipePagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("marks the current page and disables its button", () => {
    render(<RecipePagination currentPage={2} totalPages={6} onPageChange={vi.fn()} />);

    const currentPageButton = screen.getByRole("button", {
      name: "Go to page 2",
    });

    expect(currentPageButton).toHaveAttribute("aria-current", "page");
    expect(currentPageButton).toBeDisabled();
  });

  it("calls onPageChange when another page is selected", () => {
    const onPageChange = vi.fn();

    render(
      <RecipePagination currentPage={2} totalPages={6} onPageChange={onPageChange} />,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Go to page 4",
      }),
    );

    expect(onPageChange).toHaveBeenCalledTimes(1);
    expect(onPageChange).toHaveBeenCalledWith(4);
  });
});
