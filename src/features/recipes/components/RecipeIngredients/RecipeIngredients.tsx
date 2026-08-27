import React from "react";
import type { Ingredient } from "../../recipeSlice";
import styles from "./RecipeIngredients.module.css";

interface RecipeIngredientsProps {
  ingredients?: Ingredient[]; 
}

export const RecipeIngredients: React.FC<RecipeIngredientsProps> = ({ ingredients }) => {
  if (!ingredients || ingredients.length === 0) {
    return null;
  }

  return (
    <div className={styles.section}>
      <h3 className={styles.title}>Ingredients</h3>
      <ul className={styles.list}>
        {ingredients.map((item: any, index) => {
          
          const name = item.ingredient?.name || item.name;
          const image = item.ingredient?.img || item.image;
          const measure = item.measure || item.amount;

          return (
            <li key={item.ingredientId || index} className={styles.item}>
              {image && <img src={image} alt={name} className={styles.image} />}
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