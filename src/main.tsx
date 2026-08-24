import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { store } from "./store/store.ts";
import App from "./App.tsx";
import RecipeDetailsPage from "./features/recipes/RecipeDetailsPage.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/recipes/:id" element={<RecipeDetailsPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
