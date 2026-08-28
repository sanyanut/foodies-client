import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Formik, Form } from "formik";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { RecipeImageUpload } from "./RecipeImageUpload.tsx";
import { initialRecipeValues, recipeValidationSchema } from "./recipeValidationSchema.ts";

// jsdom has no object-URL support; the component creates one for the preview.
beforeAll(() => {
  globalThis.URL.createObjectURL = vi.fn(() => "blob:preview");
  globalThis.URL.revokeObjectURL = vi.fn();
});

const setup = () =>
  render(
    <Formik
      initialValues={initialRecipeValues}
      validationSchema={recipeValidationSchema}
      onSubmit={() => {}}
    >
      <Form>
        <RecipeImageUpload />
        <button type="submit">submit</button>
      </Form>
    </Formik>,
  );

describe("RecipeImageUpload", () => {
  it("clears the required-photo error once a photo is selected", async () => {
    setup();

    // Trigger validation so the error shows.
    fireEvent.click(screen.getByText("submit"));
    expect(
      await screen.findByText("Please upload a photo of your recipe"),
    ).toBeInTheDocument();

    // Selecting a file must remove the error (regression: it used to persist).
    const file = new File(["x"], "photo.png", { type: "image/png" });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(
        screen.queryByText("Please upload a photo of your recipe"),
      ).not.toBeInTheDocument();
    });
  });
});
