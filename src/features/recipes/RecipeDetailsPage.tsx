import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchRecipeById } from "./recipeSlice";

export const RecipeDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentRecipe, status, error } = useAppSelector((state) => state.recipes);

  useEffect(() => {
    const isValidMongoId = id && id.length === 24;
    const recipeId = isValidMongoId ? id : "6462a8f74c3d0ddd288980bc";

    console.log("Використовуємо ID для запиту:", recipeId);
    dispatch(fetchRecipeById(recipeId));
  }, [dispatch, id]);

  if (status === "loading") {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>Завантаження рецепта...</div>
    );
  }

  if (status === "failed") {
    return (
      <div style={{ padding: "20px", color: "red", textAlign: "center" }}>
        Помилка: {error}
      </div>
    );
  }

  if (!currentRecipe) {
    return <div style={{ padding: "20px", textAlign: "center" }}>Рецепт не знайдено</div>;
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1>{currentRecipe.title}</h1>
      <p style={{ color: "#666" }}>
        Категорія: <strong>{currentRecipe.categoryName}</strong> | Країна:{" "}
        <strong>{currentRecipe.areaName}</strong>
      </p>

      {currentRecipe.thumb && (
        <img
          src={currentRecipe.thumb}
          alt={currentRecipe.title}
          style={{
            width: "100%",
            maxHeight: "400px",
            objectFit: "cover",
            borderRadius: "8px",
            marginTop: "10px",
          }}
        />
      )}

      <p style={{ marginTop: "15px", fontSize: "16px", lineHeight: "1.5" }}>
        {currentRecipe.description}
      </p>

      <div style={{ marginTop: "20px" }}>
        <h3>Час приготування: {currentRecipe.time} хв.</h3>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h3>Інструкція приготування:</h3>
        <p style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>
          {currentRecipe.instructions}
        </p>
      </div>
    </div>
  );
};

export default RecipeDetailsPage;
