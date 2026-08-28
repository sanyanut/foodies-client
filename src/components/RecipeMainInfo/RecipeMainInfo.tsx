import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { openModal } from "../../features/ui/modalSlice.ts";
import type { Recipe } from "../../features/recipes/recipeSlice";
import styles from "./RecipeMainInfo.module.css";

interface RecipeMainInfoProps {
  recipe: Recipe;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
}

export const RecipeMainInfo: React.FC<RecipeMainInfoProps> = ({
  recipe,
  onToggleFavorite,
  isFavorite,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const handleAuthorClick = () => {
    if (!isAuthenticated) {
      dispatch(openModal("signin"));
    } else {
      const authorId = recipe.ownerId;
      // TODO: Уточнити маршрут сторінки профілю у тімліда (наприклад, `/user/${authorId}` або `/user`)
      navigate(authorId ? `/user/${authorId}` : "/user");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{recipe.title}</h1>

      <div className={styles.infoMeta}>
        <span>
          Категорія: <strong>{recipe.categoryName}</strong>
        </span>
        <span>|</span>
        <span>
          Час: <strong>{recipe.time} хв.</strong>
        </span>
      </div>

      {/* Information about the author as a button according to the requirements */}
      {recipe.owner && (
        <button type="button" onClick={handleAuthorClick} className={styles.authorButton}>
          {recipe.owner.avatar && (
            <img
              src={recipe.owner.avatar}
              alt={recipe.owner.name || "Author"}
              className={styles.authorAvatar}
            />
          )}
          <span>{recipe.owner.name || "Author"}</span>
        </button>
      )}

      {recipe.thumb && (
        <div className={styles.imageWrapper}>
          <img src={recipe.thumb} alt={recipe.title} className={styles.image} />
        </div>
      )}

      <p className={styles.description}>{recipe.description}</p>

      <button className={styles.favoriteBtn} onClick={onToggleFavorite} type="button">
        {isFavorite ? "Remove from favorites" : "Add to favorites"}
      </button>
    </div>
  );
};
