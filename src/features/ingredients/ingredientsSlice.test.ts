import { describe, it, expect, vi } from "vitest";
import { configureStore } from "@reduxjs/toolkit";

import ingredientsReducer, { fetchIngredients } from "./ingredientsSlice.ts";
import type { Ingredient } from "./ingredientsSlice.ts";
import * as apiClient from "../../lib/apiClient.ts";

const sample: Ingredient[] = [
  {
    id: "1",
    name: "Ackee",
    description: "A fruit.",
    img: "https://example.com/ackee.png",
  },
];

describe("ingredientsSlice reducer", () => {
  it("has an idle initial state", () => {
    const state = ingredientsReducer(undefined, { type: "@@INIT" });
    expect(state.status).toBe("idle");
    expect(state.items).toEqual([]);
  });

  it("sets status to loading while fetching", () => {
    const state = ingredientsReducer(undefined, fetchIngredients.pending("", undefined));
    expect(state.status).toBe("loading");
  });

  it("stores the ingredients on success", () => {
    const state = ingredientsReducer(
      undefined,
      fetchIngredients.fulfilled(sample, "", undefined),
    );
    expect(state.status).toBe("succeeded");
    expect(state.items).toEqual(sample);
  });

  it("sets status to failed with an error message on failure", () => {
    const state = ingredientsReducer(
      undefined,
      fetchIngredients.rejected(
        new Error("boom"),
        "",
        undefined,
        "Failed to fetch ingredients",
      ),
    );
    expect(state.status).toBe("failed");
    expect(state.error).toBe("Failed to fetch ingredients");
  });
});

describe("fetchIngredients caching", () => {
  it("does not re-request once the list has already been fetched", async () => {
    const requestSpy = vi
      .spyOn(apiClient, "apiRequest")
      .mockResolvedValue(sample as never);

    const store = configureStore({ reducer: { ingredients: ingredientsReducer } });

    await store.dispatch(fetchIngredients());
    await store.dispatch(fetchIngredients());

    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(store.getState().ingredients.items).toEqual(sample);

    requestSpy.mockRestore();
  });
});
