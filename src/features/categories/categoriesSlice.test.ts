import { describe, it, expect, vi } from "vitest";
import { configureStore } from "@reduxjs/toolkit";

import categoriesReducer, { fetchCategories } from "./categoriesSlice.ts";
import type { Category } from "./categoriesSlice.ts";
import * as apiClient from "../../lib/apiClient.ts";

const sample: Category[] = [{ id: "1", name: "Beef" }];

describe("categoriesSlice reducer", () => {
  it("has an idle initial state", () => {
    const state = categoriesReducer(undefined, { type: "@@INIT" });
    expect(state.status).toBe("idle");
    expect(state.items).toEqual([]);
  });

  it("sets status to loading while fetching", () => {
    const state = categoriesReducer(undefined, fetchCategories.pending("", undefined));
    expect(state.status).toBe("loading");
  });

  it("stores the categories on success", () => {
    const state = categoriesReducer(
      undefined,
      fetchCategories.fulfilled(sample, "", undefined),
    );
    expect(state.status).toBe("succeeded");
    expect(state.items).toEqual(sample);
  });

  it("sets status to failed with an error message on failure", () => {
    const state = categoriesReducer(
      undefined,
      fetchCategories.rejected(
        new Error("boom"),
        "",
        undefined,
        "Failed to fetch categories",
      ),
    );
    expect(state.status).toBe("failed");
    expect(state.error).toBe("Failed to fetch categories");
  });
});

describe("fetchCategories caching", () => {
  it("does not re-request once the list has already been fetched", async () => {
    const requestSpy = vi
      .spyOn(apiClient, "apiRequest")
      .mockResolvedValue(sample as never);

    const store = configureStore({ reducer: { categories: categoriesReducer } });

    await store.dispatch(fetchCategories());
    await store.dispatch(fetchCategories());

    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(store.getState().categories.items).toEqual(sample);

    requestSpy.mockRestore();
  });
});
