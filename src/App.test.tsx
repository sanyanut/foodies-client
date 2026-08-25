import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";

import { store } from "./store/store.ts";
import App from "./App.tsx";

const renderApp = () =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </Provider>,
  );

describe("<App />", () => {
  it("renders the Foodies logo in the shell", () => {
    renderApp();
    // Header + Footer both render a logo link.
    expect(screen.getAllByRole("link", { name: /foodies/i }).length).toBeGreaterThan(0);
  });

  it("shows the guest auth actions when logged out", () => {
    renderApp();
    expect(screen.getAllByRole("button", { name: /sign up/i }).length).toBeGreaterThan(0);
  });
});
