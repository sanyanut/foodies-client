import { describe, it, expect, vi } from "vitest";
import { configureStore } from "@reduxjs/toolkit";

import areasReducer, { fetchAreas } from "./areasSlice.ts";
import type { Area } from "./areasSlice.ts";
import * as apiClient from "../../lib/apiClient.ts";

const sample: Area[] = [{ id: "1", name: "Ukrainian" }];

describe("areasSlice reducer", () => {
  it("has an idle initial state", () => {
    const state = areasReducer(undefined, { type: "@@INIT" });
    expect(state.status).toBe("idle");
    expect(state.items).toEqual([]);
  });

  it("sets status to loading while fetching", () => {
    const state = areasReducer(undefined, fetchAreas.pending("", undefined));
    expect(state.status).toBe("loading");
  });

  it("stores the areas on success", () => {
    const state = areasReducer(undefined, fetchAreas.fulfilled(sample, "", undefined));
    expect(state.status).toBe("succeeded");
    expect(state.items).toEqual(sample);
  });

  it("sets status to failed with an error message on failure", () => {
    const state = areasReducer(
      undefined,
      fetchAreas.rejected(new Error("boom"), "", undefined, "Failed to fetch areas"),
    );
    expect(state.status).toBe("failed");
    expect(state.error).toBe("Failed to fetch areas");
  });
});

describe("fetchAreas caching", () => {
  it("does not re-request once the list has already been fetched", async () => {
    const requestSpy = vi
      .spyOn(apiClient, "apiRequest")
      .mockResolvedValue(sample as never);

    const store = configureStore({ reducer: { areas: areasReducer } });

    await store.dispatch(fetchAreas());
    await store.dispatch(fetchAreas());

    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(store.getState().areas.items).toEqual(sample);

    requestSpy.mockRestore();
  });
});
