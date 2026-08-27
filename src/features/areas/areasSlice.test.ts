import { describe, it, expect } from "vitest";

import areasReducer, { fetchAreas } from "./areasSlice.ts";
import type { Area } from "./areasSlice.ts";

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
