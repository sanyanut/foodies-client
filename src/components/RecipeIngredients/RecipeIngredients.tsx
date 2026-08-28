import React from "react";
import type { Ingredient } from "../../features/recipes/recipeSlice";
import styles from "./RecipeIngredients.module.css";

type RecipeIngredientItem = Ingredient & {
  ingredient?: {
    name?: string;
    img?: string;
  };
  name?: string;
  img?: string;
  image?: string;
  measure?: string;
  amount?: string;
  ingredientId?: string | number;
  _id?: string | number;
};

interface RecipeIngredientsProps {
  ingredients?: RecipeIngredientItem[];
}

export const RecipeIngredients: React.FC<RecipeIngredientsProps> = ({ ingredients }) => {
  if (!ingredients || ingredients.length === 0) {
    return null;
  }

  return (
    <div className={styles.section}>
      <h3 className={styles.title}>Ingredients</h3>
      <ul className={styles.list}>
        {ingredients.map((item, index) => {
          const name = item.ingredient?.name || item.name;
          const image = item.ingredient?.img || item.image || item.img;
          const measure = item.measure || item.amount;
          const keyId = item.ingredientId || item._id || index;

          return (
            <li key={keyId} className={styles.item}>
              {image && (
                <img src={image} alt={name || "Ingredient"} className={styles.image} />
              )}
              <div className={styles.info}>
                <span className={styles.name}>{name}</span>
                <span className={styles.amount}>{measure}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
