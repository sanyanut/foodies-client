import { Link, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../store/hooks.ts";
import { openModal } from "../../features/ui/modalSlice.ts";
import { toggleFavorite } from "../../features/recipes/favoritesSlice.ts";
import type { RecipeCardData } from "../../features/recipes/types.ts";
import { Icon } from "../../shared/Icon/Icon.tsx";

interface RecipeCardProps {
  recipe: RecipeCardData;
}

/**
 * Universal recipe card (ТЗ): image, title, description, an author button
 * (guest → Sign In modal, authed → the author's UserPage), a favorite heart
 * (guest → Sign In modal, authed → add/remove favorite, accent when favorited),
 * and an arrow that opens the recipe's page.
 */
export const RecipeCard = ({ recipe }: RecipeCardProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isFavorite = useAppSelector((state) => state.favorites.ids.includes(recipe.id));

  const imageUrl = recipe.thumb ?? recipe.preview;
  const ownerInitial = recipe.owner.name.trim().charAt(0).toUpperCase() || "?";

  const handleAuthorClick = () => {
    if (isAuthenticated) navigate(`/user/${recipe.ownerId}`);
    else dispatch(openModal("signin"));
  };

  const handleFavoriteClick = () => {
    if (isAuthenticated) void dispatch(toggleFavorite(recipe.id));
    else dispatch(openModal("signin"));
  };

  return (
    <article className="flex min-w-0 flex-col">
      <Link
        to={`/recipe/${recipe.id}`}
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
        to={`/recipe/${recipe.id}`}
        className="mt-[16px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main"
      >
        <h3 className="truncate text-[18px] md:text-[20px] font-extrabold uppercase leading-[24px] tracking-[-0.32px]">
          {recipe.title}
        </h3>
      </Link>

      <p className="mt-[8px] line-clamp-2 min-h-[40px] text-[14px] md:text-[16px] font-medium leading-[20px] md:leading-[24px] tracking-[-0.28px] text-dark">
        {recipe.description ?? ""}
      </p>

      <div className="mt-[8px] flex items-center justify-between gap-[12px]">
        <button
          type="button"
          onClick={handleAuthorClick}
          aria-label={`View ${recipe.owner.name}'s profile`}
          className="group flex min-w-0 items-center gap-[8px] rounded-full text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main cursor-pointer"
        >
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

          <span className="truncate text-[12px] font-bold leading-[18px] tracking-[-0.24px] transition-colors group-hover:text-gray">
            {recipe.owner.name}
          </span>
        </button>

        <div className="flex shrink-0 items-center gap-[4px]">
          <button
            type="button"
            aria-label={
              isFavorite
                ? `Remove ${recipe.title} from favorites`
                : `Add ${recipe.title} to favorites`
            }
            aria-pressed={isFavorite}
            onClick={handleFavoriteClick}
            className={`flex h-[36px] w-[36px] items-center justify-center rounded-full border transition-colors ${
              isFavorite
                ? "border-main bg-main text-white"
                : "border-gray/60 bg-white text-main hover:border-main"
            }`}
          >
            <Icon name="heart" className="h-[18px] w-[18px]" />
          </button>

          <Link
            to={`/recipe/${recipe.id}`}
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
