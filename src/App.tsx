import { BrowserRouter, Routes, Route } from "react-router-dom";

import { SharedLayout } from "./layouts/SharedLayout.tsx";
import { ProtectedRoute } from "./routes/ProtectedRoute.tsx";
import { HomePage } from "./pages/HomePage/HomePage.tsx";
import { AddRecipePage } from "./pages/AddRecipePage/AddRecipePage.tsx";
import { UserPage } from "./pages/UserPage/UserPage.tsx";
import { NotFoundPage } from "./pages/NotFoundPage/NotFoundPage.tsx";
import { RecipeDetailsPage } from "./pages/RecipeDetailsPage/RecipeDetailsPage.tsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SharedLayout />}>
          <Route index element={<HomePage />} />
          <Route path="recipes/:id" element={<RecipeDetailsPage />} />
          <Route
            path="add-recipe"
            element={
              <ProtectedRoute>
                <AddRecipePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="user/:id"
            element={
              <ProtectedRoute>
                <UserPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
