import React from "react";
import { Link } from "react-router-dom";
import type { Recipe } from "../../recipeSlice";
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
  // Використовуємо реальні дані або мокові для тестування
  const displayRecipes = recipes && recipes.length > 0 ? recipes : mockPopularRecipes;

  return (
    <div className={styles.popularSection}>
      <h3 className={styles.sectionTitle}>Popular recipes</h3>
      <div className={styles.popularGrid}>
        {displayRecipes.slice(0, 4).map((recipe) => {
          const recipeId = recipe.id || recipe._id;

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
                      className={styles.iconButton}
                      type="button"
                      aria-label="Add to favorites"
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

// Оновлені мокові дані (для тестування) з полями owner та instructions
const mockPopularRecipes: Partial<Recipe>[] = [
  {
    _id: "1",
    title: "FLAMICHE",
    thumb: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
    instructions:
      "For the pastry, sift the flour and salt into the bowl of a food processor, add the butter and process briefly until the mixture resembles fine breadcrumbs. Add one tablespoon of water and process again; add more water...",
    owner: { name: "Ivetta", avatar: "https://randomuser.me/api/portraits/women/45.jpg" },
  },
  {
    _id: "2",
    title: "BEEF WELLINGTON",
    thumb: "https://images.unsplash.com/photo-1544025162-d76694265947",
    instructions:
      "Put the mushrooms into a food processor with some seasoning and pulse to a rough paste. Fry the paste over a high heat for 10 mins, stirring often, to remove the moisture. Cool completely. Brush the beef with mustard...",
    owner: { name: "Victor", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
  },
  {
    _id: "3",
    title: "TUNA NICOISE",
    thumb: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
    instructions:
      "Heat oven to 200C/fan 180C/gas 6. Toss the potatoes with 2 tsp oil and some seasoning on a baking tray. Roast for 20 mins. Cook the beans in boiling water for 4 mins, drain and refresh...",
    owner: { name: "Nadia", avatar: "https://randomuser.me/api/portraits/women/60.jpg" },
  },
  {
    _id: "4",
    title: "GRILLED MAC AND CHEESE",
    thumb: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af",
    instructions:
      "Make the mac and cheese. Bring a medium saucepan of generously salted water to the boil. Add the pasta and cook according to the packet instructions. Drain and set aside. Make a cheese sauce. Melt the butter...",
    owner: { name: "Andrew", avatar: "https://randomuser.me/api/portraits/men/55.jpg" },
  },
];

export default PopularRecipes;
