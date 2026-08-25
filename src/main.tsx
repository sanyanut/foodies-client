import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import "@fontsource/mulish/400.css";
import "@fontsource/mulish/500.css";
import "@fontsource/mulish/600.css";
import "@fontsource/mulish/700.css";

import { store } from "./store/store.ts";
import { bootstrap, forceLogout } from "./features/auth/authSlice.ts";
import { registerAuthFailureHandler } from "./lib/apiClient.ts";
import App from "./App.tsx";
import "./index.css";

// When a token refresh ultimately fails, drop the client session too.
registerAuthFailureHandler(() => {
  store.dispatch(forceLogout());
});

// Validate any persisted session (silent refresh) before/while the app renders.
store.dispatch(bootstrap());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
