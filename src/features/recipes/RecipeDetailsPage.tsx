import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchRecipeById } from "./recipeSlice";
import { RecipeIngredients } from "./components/RecipeIngredients/RecipeIngredients";
import axios from "axios"; 
import styles from './RecipeDetailsPage.module.css';

export const RecipeDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentRecipe, status, error } = useAppSelector((state) => state.recipes);

  // State to hold popular recipes for the bottom block
  const [popularRecipes, setPopularRecipes] = useState<any[]>([]);

  useEffect(() => {
    const isValidMongoId = id && id.length === 24;
    const recipeId = isValidMongoId ? id : "6462a8f74c3d0ddd288980bc";

    dispatch(fetchRecipeById(recipeId));

    // Fetch popular recipes for the bottom section
    axios.get("/recipes/popular?limit=4")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];
        setPopularRecipes(data);
      })
      .catch((err) => console.log("Error loading popular recipes:", err));
  }, [dispatch, id]);

  // Loading state handler
  if (status === "loading") {
    return <div className={styles.loading}>Loading recipe...</div>;
  }

  // Error state handler
  if (status === "failed") {
    return <div className={styles.loading} style={{ color: "red" }}>Error: {error}</div>;
  }

  // Not found fallback
  if (!currentRecipe) {
    return <div className={styles.loading}>Recipe not found</div>;
  }
console.log("Current recipe data:", currentRecipe);
  return (
    <div className={styles.container}>
      
      {/* Breadcrumbs navigation */}
      <div className={styles.breadcrumbs}>
        <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>HOME</span> / <span>{currentRecipe.title}</span>
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

        {/* Right column: ALL info, ingredients, preparation and button together */}
        <div className={styles.infoColumn}>
          <h1 className={styles.title}>{currentRecipe.title}</h1>
          
          {/* Tags row: Category and Time */}
          <div className={styles.tagsRow}>
            {currentRecipe.category && (
              <span className={styles.timeBadge}>{currentRecipe.category.name}</span>
            )}
            <span className={styles.timeBadge}>{currentRecipe.time} min</span>
          </div>

          {/* Author block */}
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
                  {currentRecipe.owner.name ? currentRecipe.owner.name[0].toUpperCase() : "U"}
                </div>
              )}
              <div className={styles.authorText}>
                <span className={styles.createdByLabel}>Created by:</span>
                <span className={styles.authorName}>{currentRecipe.owner.name || "User"}</span>
              </div>
            </div>
          )}

          {/* Ingredients inside right column */}
          <RecipeIngredients ingredients={currentRecipe.ingredients} />

          {/* Recipe Preparation inside right column */}
          <div className={styles.preparationSection}>
            <h3 className={styles.sectionTitle}>Recipe Preparation</h3>
            <p className={styles.preparationText}>
              {currentRecipe.instructions}
            </p>

            <button className={styles.favoriteButton}>
              Add to favorites
            </button>
          </div>

        </div>

      </div>

      {/* Popular recipes bottom block */}
      {popularRecipes.length > 0 && (
        <div className={styles.popularSection}>
          <h3 className={styles.sectionTitle}>Popular recipes</h3>
          <div className={styles.popularGrid}>
            {popularRecipes.map((recipe) => (
              <Link 
                key={recipe.id} 
                to={`/recipe/${recipe.id}`} 
                className={styles.popularCard}
              >
                <img 
                  src={recipe.thumb} 
                  alt={recipe.title} 
                  className={styles.popImage} 
                />
                <div className={styles.popContent}>
                  <h4 className={styles.popTitle}>{recipe.title}</h4>
                  <span className={styles.popLink}>View recipe &rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      

    </div>

  );

};

export default RecipeDetailsPage;