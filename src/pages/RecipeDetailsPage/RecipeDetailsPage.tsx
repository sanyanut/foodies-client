import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchRecipeById, fetchPopularRecipes } from "../../features/recipes/recipeSlice";
import { fetchFavorites, toggleFavorite } from "../../features/recipes/favoritesSlice";
import { openModal } from "../../features/ui/modalSlice";
import { Breadcrumbs } from "../../components/Breadcrumbs/Breadcrumbs";
import { RecipeIngredients } from "../../components/RecipeIngredients/RecipeIngredients";
import { RecipePreparation } from "../../components/RecipePreparation/RecipePreparation";
import { PopularRecipes } from "../../components/PopularRecipes/PopularRecipes";
import styles from "./RecipeDetailsPage.module.css";

export const RecipeDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentRecipe, popularRecipes, status, error } = useAppSelector(
    (state) => state.recipes,
  );
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const favoriteIds = useAppSelector((state) => state.favorites.ids);

  const recipeId = currentRecipe?.id;
  const isFavorite = recipeId ? favoriteIds.includes(recipeId) : false;

  // Load the recipe + the popular list whenever the id in the URL changes.
  useEffect(() => {
    if (id) dispatch(fetchRecipeById(id));
    void dispatch(fetchPopularRecipes());
  }, [dispatch, id]);

  // Seed favorites so the heart reflects reality (the endpoint is auth-only).
  useEffect(() => {
    if (isAuthenticated) void dispatch(fetchFavorites());
  }, [dispatch, isAuthenticated]);

  // Guests are prompted to sign in; authed users toggle via the shared slice
  // (correct API base + Bearer auth), instead of an unauthenticated axios call.
  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      dispatch(openModal("signin"));
      return;
    }
    if (recipeId) void dispatch(toggleFavorite(recipeId));
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
      <Breadcrumbs currentPage={currentRecipe.title} />

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

          {currentRecipe.description && (
            <p className={styles.description}>{currentRecipe.description}</p>
          )}

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
