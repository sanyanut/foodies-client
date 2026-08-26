import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";

import { store } from "../../../store/store.ts";
import { SignInForm } from "./SignInForm.tsx";

describe("<SignInForm />", () => {
  it("shows validation errors on empty submit", async () => {
    render(
      <Provider store={store}>
        <SignInForm />
      </Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });
});
