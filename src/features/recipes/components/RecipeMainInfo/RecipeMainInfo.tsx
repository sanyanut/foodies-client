import React from "react";
import type { Recipe } from "../../recipeSlice";
import styles from "./RecipeMainInfo.module.css";

interface RecipeMainInfoProps {
  recipe: Recipe;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
}

export const RecipeMainInfo: React.FC<RecipeMainInfoProps> = ({
  recipe,
  onToggleFavorite,
}) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{recipe.title}</h1>
      
      <div className={styles.infoMeta}>
        <span>Категорія: <strong>{recipe.categoryName}</strong></span>
        <span>|</span>
        <span>Час: <strong>{recipe.time} хв.</strong></span>
      </div>

      {recipe.thumb && (
        <div className={styles.imageWrapper}>
          <img src={recipe.thumb} alt={recipe.title} className={styles.image} />
        </div>
      )}

      <p className={styles.description}>{recipe.description}</p>

      <button className={styles.favoriteBtn} onClick={onToggleFavorite}>
        Add to favorites
      </button>
    </div>
  );
};