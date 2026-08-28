import { Link } from "react-router-dom";
import { Icon } from "../../shared/Icon/Icon.tsx";

export interface IRecipePreview {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  thumb?: string;
}

interface IRecipePreviewProps {
  readonly recipe: IRecipePreview;
  readonly isOwner: boolean;
  readonly onDelete: (id: string) => void;
}

export function RecipePreview({ recipe, isOwner, onDelete }: IRecipePreviewProps) {
  const recipeId = recipe.id ?? recipe._id ?? "";

  const btnClass =
    "flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-gray-300 text-main transition-colors hover:border-main hover:bg-main hover:text-white";

  return (
    <div className="flex items-center gap-4 border-b border-gray-200 py-6 last:border-b-0">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-[20px]">
        <img
          src={recipe.thumb ?? "https://placehold.co/100x100"}
          alt={recipe.title}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-col flex-grow min-w-0 pr-4">
        <h3 className="truncate text-[16px] font-bold uppercase text-main mb-2">
          {recipe.title}
        </h3>
        <p className="line-clamp-2 text-[14px] font-medium text-main/60">
          {recipe.description}
        </p>
      </div>

      <div className="flex flex-row gap-2 flex-shrink-0">
        <Link to={`/recipe/${recipeId}`} className={btnClass}>
          <Icon name="arrow-up-right" className="h-4 w-4" />
        </Link>

        {isOwner && (
          <button
            type="button"
            onClick={() => onDelete(recipeId)}
            className={`${btnClass} cursor-pointer`}
          >
            <Icon name="trash" className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
