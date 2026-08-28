import { Link } from "react-router-dom";
import { Icon } from "../../shared/Icon/Icon.tsx";
import { AVATAR_MOT_FOUND_IMG } from "../../shared/constants.ts";
import { useAppSelector } from "../../store/hooks.ts";

export interface IFollowUser {
  id: string;
  name: string;
  avatar?: string | null;
  recipesCount?: number;
  isFollowedByMe: boolean;
  recipes?: Array<{ id: string; thumb: string; title: string }>;
}

interface FollowUserCardProps {
  user: IFollowUser;
  onToggleFollow: (userId: string, isFollowed: boolean) => void;
}

export function FollowUserCard({ user, onToggleFollow }: FollowUserCardProps) {
  const authUserId = useAppSelector((state) => state.auth.user?.id);
  const isSelf = authUserId === user.id;

  return (
    <div className="flex items-center justify-between gap-4 border-b border-gray-200 py-6 last:border-b-0">
      {/* Аватар + інфо + кнопка */}
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="h-16 w-16 sm:h-[75px] sm:w-[75px] flex-shrink-0 overflow-hidden rounded-full">
          <img
            src={user.avatar ?? AVATAR_MOT_FOUND_IMG}
            alt={user.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <h3 className="text-[16px] sm:text-[18px] font-bold uppercase text-main">
            {user.name}
          </h3>

          {typeof user.recipesCount === "number" && (
            <p className="text-[12px] sm:text-[14px] text-gray-400 font-medium">
              Own recipes: {user.recipesCount}
            </p>
          )}

          {!isSelf && (
            <button
              type="button"
              onClick={() => onToggleFollow(user.id, user.isFollowedByMe)}
              className="mt-1 inline-flex w-fit items-center justify-center rounded-full border border-gray-300 px-5 py-1.5 text-[12px] sm:text-[14px] font-bold uppercase tracking-wider text-main transition-colors hover:border-main hover:bg-main hover:text-white cursor-pointer"
            >
              {user.isFollowedByMe ? "UNFOLLOW" : "FOLLOW"}
            </button>
          )}
        </div>
      </div>

      {/* Прев'ю рецептів (тільки desktop/tablet) */}
      {(user.recipes?.length ?? 0) > 0 && (
        <div className="hidden md:flex items-center gap-3 overflow-hidden">
          {user.recipes!.slice(0, 4).map((recipe) => (
            <div
              key={recipe.id}
              className="h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 overflow-hidden rounded-[14px]"
            >
              <img
                src={recipe.thumb}
                alt={recipe.title}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Посилання на профіль */}
      <Link
        to={isSelf ? "/profile" : `/user/${user.id}`}
        className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-gray-300 text-main transition-colors hover:border-main hover:bg-main hover:text-white flex-shrink-0"
      >
        <Icon name="arrow-up-right" className="h-4 w-4" />
      </Link>
    </div>
  );
}
