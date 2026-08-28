import React from "react";
import { Link } from "react-router-dom";
import type { Recipe } from "../../features/recipes/recipeSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { toggleFavorite } from "../../features/recipes/favoritesSlice";
import { openModal } from "../../features/ui/modalSlice";
import styles from "./PopularRecipes.module.css";

interface IconProps {
  name: string;
  width?: number;
  height?: number;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ name, width, height, className }) => (
  <svg width={width} height={height} className={className} aria-hidden="true">
    <use href={`/icons/sprite.svg#${name}`} />
  </svg>
);

interface PopularRecipesProps {
  recipes: Recipe[];
}

export const PopularRecipes: React.FC<PopularRecipesProps> = ({ recipes }) => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const favoriteIds = useAppSelector((state) => state.favorites.ids);

  if (!recipes || recipes.length === 0) return null;

  return (
    <div className={styles.popularSection}>
      <h3 className={styles.sectionTitle}>Popular recipes</h3>
      <div className={styles.popularGrid}>
        {recipes.slice(0, 4).map((recipe) => {
          const recipeId = recipe.id || recipe._id;
          const isFavorite = recipeId ? favoriteIds.includes(recipeId) : false;

          const handleToggleFavorite = () => {
            if (!isAuthenticated) {
              dispatch(openModal("signin"));
              return;
            }
            if (recipeId) void dispatch(toggleFavorite(recipeId));
          };

          const shortDescription = recipe.instructions
            ? recipe.instructions.substring(0, 130) + "..."
            : "";

          return (
            <div key={recipeId} className={styles.popularCard}>
              <Link to={`/recipe/${recipeId}`}>
                <img
                  src={recipe.thumb || "https://via.placeholder.com/150"}
                  alt={recipe.title}
                  className={styles.popImage}
                />
              </Link>
              <div className={styles.popContent}>
                <div className={styles.popHeader}>
                  <Link to={`/recipe/${recipeId}`} style={{ textDecoration: "none" }}>
                    <h4 className={styles.popTitle}>{recipe.title}</h4>
                  </Link>
                </div>

                {/* Опис рецепта */}
                <p className={styles.popDescription}>{shortDescription}</p>

                {/* Блок автора та іконок у кружечках */}
                <div className={styles.popFooter}>
                  {recipe.owner && (
                    <div className={styles.authorSection}>
                      {recipe.owner.avatar ? (
                        <img
                          src={recipe.owner.avatar}
                          alt={recipe.owner.name || "Author"}
                          className={styles.authorAvatar}
                        />
                      ) : (
                        <div className={styles.authorAvatarPlaceholder}>
                          {recipe.owner.name ? recipe.owner.name[0].toUpperCase() : "U"}
                        </div>
                      )}
                      <span className={styles.authorName}>
                        {recipe.owner.name || "User"}
                      </span>
                    </div>
                  )}

                  {/* Кнопки у кружечках відповідно до макета */}
                  <div className={styles.cardActions}>
                    <button
                      className={`${styles.iconButton} ${
                        isFavorite ? styles.iconButtonActive : ""
                      }`}
                      type="button"
                      onClick={handleToggleFavorite}
                      aria-pressed={isFavorite}
                      aria-label={
                        isFavorite ? "Remove from favorites" : "Add to favorites"
                      }
                    >
                      <Icon
                        name="icon-heart"
                        width={16}
                        height={16}
                        className={styles.heartIcon}
                      />
                    </button>
                    <Link
                      to={`/recipe/${recipeId}`}
                      className={styles.iconButton}
                      aria-label="View recipe"
                    >
                      <Icon
                        name="icon-arrow-up-right"
                        width={16}
                        height={16}
                        className={styles.arrowIcon}
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PopularRecipes;
