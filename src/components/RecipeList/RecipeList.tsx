import { RecipeCard } from "../RecipeCard/RecipeCard.tsx";
import type { RecipeCardData } from "../../features/recipes/types.ts";

/** Universal list of recipes (ТЗ) — a responsive grid of RecipeCard items. */
interface RecipeListProps {
  recipes: RecipeCardData[];
  className?: string;
}

export const RecipeList = ({ recipes, className = "" }: RecipeListProps) => (
  <ul
    className={`grid grid-cols-1 gap-x-[20px] gap-y-[40px] md:grid-cols-2 xl:grid-cols-3 ${className}`}
  >
    {recipes.map((recipe) => (
      <li key={recipe.id} className="min-w-0">
        <RecipeCard recipe={recipe} />
      </li>
    ))}
  </ul>
);
