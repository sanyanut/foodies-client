import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";

import { store } from "./store/store.ts";
import App from "./App.tsx";

const renderApp = () =>
  render(
    <Provider store={store}>
      <App />
    </Provider>,
  );

describe("<App />", () => {
  it("renders the Foodies heading", () => {
    renderApp();
    expect(screen.getByRole("heading", { name: /foodies/i })).toBeInTheDocument();
  });

  it("renders the backend check button", () => {
    renderApp();
    expect(screen.getByRole("button", { name: /check backend/i })).toBeInTheDocument();
  });
});
