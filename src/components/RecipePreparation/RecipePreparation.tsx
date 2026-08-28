import React from "react";
import styles from "./RecipePreparation.module.css";

interface RecipePreparationProps {
  instructions: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const RecipePreparation: React.FC<RecipePreparationProps> = ({
  instructions,
  isFavorite,
  onToggleFavorite,
}) => {
  if (!instructions) return null;

  return (
    <div className={styles.preparationSection}>
      <h3 className={styles.sectionTitle}>Recipe Preparation</h3>
      <p className={styles.preparationText}>{instructions}</p>

      <button className={styles.favoriteButton} onClick={onToggleFavorite} type="button">
        {isFavorite ? "Remove from favorites" : "Add to favorites"}
      </button>
    </div>
  );
};

export default RecipePreparation;
