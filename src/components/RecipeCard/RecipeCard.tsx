import { Link } from "react-router-dom";

import type { RecipeCardData } from "../../features/recipes/types.ts";
import { Icon } from "../../shared/Icon/Icon.tsx";

interface RecipeCardProps {
  recipe: RecipeCardData;
  isFavorite?: boolean;
  onFavoriteToggle?: (recipeId: string) => void;
}

export const RecipeCard = ({
  recipe,
  isFavorite = false,
  onFavoriteToggle,
}: RecipeCardProps) => {
  const imageUrl = recipe.thumb ?? recipe.preview;
  const ownerInitial = recipe.owner.name.trim().charAt(0).toUpperCase() || "?";

  const handleFavoriteClick = () => {
    onFavoriteToggle?.(recipe.id);
  };

  return (
    <article className="flex min-w-0 flex-col">
      <Link
        to={`/recipes/${recipe.id}`}
        className="group block aspect-square overflow-hidden rounded-[20px] bg-gray/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={recipe.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-[14px] font-medium text-gray">
            No image
          </span>
        )}
      </Link>

      <Link
        to={`/recipes/${recipe.id}`}
        className="mt-[16px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main"
      >
        <h3 className="truncate text-[16px] font-extrabold uppercase leading-[24px] tracking-[-0.32px]">
          {recipe.title}
        </h3>
      </Link>

      <p className="mt-[8px] line-clamp-2 min-h-[40px] text-[14px] font-medium leading-[20px] tracking-[-0.28px] text-dark">
        {recipe.description ?? ""}
      </p>

      <div className="mt-[16px] flex items-center justify-between gap-[12px]">
        <div className="flex min-w-0 items-center gap-[8px]">
          {recipe.owner.avatar ? (
            <img
              src={recipe.owner.avatar}
              alt=""
              loading="lazy"
              className="h-[32px] w-[32px] shrink-0 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full bg-gray/30 text-[12px] font-bold">
              {ownerInitial}
            </span>
          )}

          <span className="truncate text-[12px] font-bold leading-[18px] tracking-[-0.24px]">
            {recipe.owner.name}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-[4px]">
          <button
            type="button"
            aria-label={
              isFavorite
                ? `Remove ${recipe.title} from favorites`
                : `Add ${recipe.title} to favorites`
            }
            aria-pressed={isFavorite}
            disabled={!onFavoriteToggle}
            onClick={handleFavoriteClick}
            className={`flex h-[36px] w-[36px] items-center justify-center rounded-full border transition-colors disabled:cursor-default ${
              isFavorite
                ? "border-main bg-main text-white"
                : "border-gray/60 bg-white text-main hover:border-main"
            }`}
          >
            <Icon name="heart" className="h-[18px] w-[18px]" />
          </button>

          <Link
            to={`/recipes/${recipe.id}`}
            aria-label={`Open ${recipe.title}`}
            className="flex h-[36px] w-[36px] items-center justify-center rounded-full border border-gray/60 text-main transition-colors hover:border-main focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main"
          >
            <Icon name="arrow-up-right" className="h-[18px] w-[18px]" />
          </Link>
        </div>
      </div>
    </article>
  );
};
