import { describe, it, expect } from "vitest";

import healthReducer, { pingBackend } from "./healthSlice.ts";

describe("healthSlice reducer", () => {
  it("has an idle initial state", () => {
    const state = healthReducer(undefined, { type: "@@INIT" });
    expect(state.status).toBe("idle");
    expect(state.lastCheckedAt).toBeNull();
  });

  it("sets status to loading while pinging", () => {
    const state = healthReducer(undefined, pingBackend.pending("", undefined));
    expect(state.status).toBe("loading");
  });

  it("sets status to up on success", () => {
    const state = healthReducer(
      undefined,
      pingBackend.fulfilled({ status: "ok" }, "", undefined),
    );
    expect(state.status).toBe("up");
    expect(state.lastCheckedAt).not.toBeNull();
  });

  it("sets status to down on failure", () => {
    const state = healthReducer(
      undefined,
      pingBackend.rejected(new Error("boom"), "", undefined),
    );
    expect(state.status).toBe("down");
  });
});
