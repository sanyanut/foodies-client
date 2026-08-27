import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchRecipeById } from "./recipeSlice";
import { RecipeIngredients } from "./components/RecipeIngredients/RecipeIngredients";
import { RecipePreparation } from "./components/RecipePreparation/RecipePreparation";
import { PopularRecipes } from "./components/PopularRecipes/PopularRecipes";
import type { Recipe } from "./recipeSlice";
import axios from "axios";
import styles from "./RecipeDetailsPage.module.css";

export const RecipeDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentRecipe, status, error } = useAppSelector((state) => state.recipes);

  const [popularRecipes, setPopularRecipes] = useState<Recipe[]>([]);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  useEffect(() => {
    const isValidMongoId = id && id.length === 24;
    const recipeId = isValidMongoId ? id : "6462a8f74c3d0ddd288980bc";

    dispatch(fetchRecipeById(recipeId));

    axios
      .get("/recipes/popular?limit=4")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];
        setPopularRecipes(data);
      })
      .catch((err) => console.log("Error loading popular recipes:", err));
  }, [dispatch, id]);

  const handleToggleFavorite = async () => {
    try {
      const recipeId = currentRecipe?.id || currentRecipe?._id;
      if (isFavorite) {
        await axios.delete(`/recipes/${recipeId}/favorite`);
        setIsFavorite(false);
      } else {
        await axios.post(`/recipes/${recipeId}/favorite`);
        setIsFavorite(true);
      }
    } catch (err) {
      console.log("Error updating favorites:", err);
    }
  };

  if (status === "loading") {
    return <div className={styles.loading}>Loading recipe...</div>;
  }

  if (status === "failed") {
    return (
      <div className={styles.loading} style={{ color: "red" }}>
        Error: {error}
      </div>
    );
  }

  if (!currentRecipe) {
    return <div className={styles.loading}>Recipe not found</div>;
  }

  return (
    <div className={styles.container}>
      {/* Breadcrumbs navigation */}
      <div className={styles.breadcrumbs}>
        <span onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          HOME
        </span>{" "}
        / <span>{currentRecipe.title}</span>
      </div>

      {/* Main two-column layout */}
      <div className={styles.mainLayout}>
        {/* Left column: Large recipe image */}
        <div className={styles.imageColumn}>
          {currentRecipe.thumb && (
            <img
              src={currentRecipe.thumb}
              alt={currentRecipe.title}
              className={styles.mainImage}
            />
          )}
        </div>

        {/* Right column */}
        <div className={styles.infoColumn}>
          <h1 className={styles.title}>{currentRecipe.title}</h1>

          <div className={styles.tagsRow}>
            {currentRecipe.category && (
              <span className={styles.timeBadge}>{currentRecipe.category.name}</span>
            )}
            <span className={styles.timeBadge}>{currentRecipe.time} min</span>
          </div>

          {currentRecipe.owner && (
            <div className={styles.authorSection}>
              {currentRecipe.owner.avatar ? (
                <img
                  src={currentRecipe.owner.avatar}
                  alt={currentRecipe.owner.name || "Author"}
                  className={styles.authorAvatar}
                />
              ) : (
                <div className={styles.authorAvatarPlaceholder}>
                  {currentRecipe.owner.name
                    ? currentRecipe.owner.name[0].toUpperCase()
                    : "U"}
                </div>
              )}
              <div className={styles.authorText}>
                <span className={styles.createdByLabel}>Created by:</span>
                <span className={styles.authorName}>
                  {currentRecipe.owner.name || "User"}
                </span>
              </div>
            </div>
          )}

          <RecipeIngredients ingredients={currentRecipe.ingredients} />

          {/* Блок приготування разом із кнопкою улюблених */}
          <RecipePreparation
            instructions={currentRecipe.instructions}
            isFavorite={isFavorite}
            onToggleFavorite={handleToggleFavorite}
          />
        </div>
      </div>

      {/* Popular recipes section */}
      <PopularRecipes recipes={popularRecipes} />
    </div>
  );
};

export default RecipeDetailsPage;
