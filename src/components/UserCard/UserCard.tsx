import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { LongButton } from "../../fragments/LongButton/LongButton";
import { openModal } from "../../features/ui/modalSlice.ts";
import { useAppDispatch, useAppSelector } from "../../store/hooks.ts";
import { AVATAR_MOT_FOUND_IMG } from "../../shared/constants.ts";
import type { RootState } from "../../store/store.ts";
import {
  clearViewedProfile,
  fetchMyProfile,
  fetchPublicProfile,
  type MyProfile,
} from "../../features/user/userSlice.ts";

export function UserCard() {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const { viewedProfile, isMyProfile, status } = useAppSelector(
    (state: RootState) => state.user,
  );

  useEffect(() => {
    if (id) {
      // Є ID в URL — вантажимо чужий публічний профіль
      dispatch(fetchPublicProfile(id));
    } else {
      // Немає ID (/profile) — вантажимо свій профіль
      dispatch(fetchMyProfile());
    }

    // Очищаємо профіль при виході зі сторінки, щоб не миготіли старі дані
    return () => {
      dispatch(clearViewedProfile());
    };
  }, [dispatch, id]); // Перезапускається при зміні id (перехід між профілями)

  if (status === "loading") {
    return <div>Loading profile...</div>;
  }

  if (!viewedProfile) {
    return <div>Profile not found</div>;
  }

  // Виносимо кнопку в змінну, щоб TypeScript міг правильно звузити тип (type narrowing)
  // і щоб уникнути вкладених тернарників прямо в JSX
  let actionButton: React.ReactNode;
  if (isMyProfile) {
    actionButton = (
      <LongButton variant="solid" onClick={() => dispatch(openModal("logout"))}>
        Log Out
      </LongButton>
    );
  } else if ("isFollowedByMe" in viewedProfile && viewedProfile.isFollowedByMe) {
    // "isFollowedByMe" in viewedProfile — звужує тип до PublicProfile
    actionButton = (
      <LongButton
        variant="outline"
        onClick={() => {
          /* TODO: dispatch unfollow */
        }}
      >
        Unfollow
      </LongButton>
    );
  } else {
    actionButton = (
      <LongButton
        variant="solid"
        onClick={() => {
          /* TODO: dispatch follow */
        }}
      >
        Follow
      </LongButton>
    );
  }

  return (
    <>
      <section className="w-full max-w-[400px] flex flex-col items-center rounded-[32px] border border-gray-200 px-[80px] py-[40px] mb-[20px] bg-white">
        {/* Аватарка */}
        <div className="relative mb-6">
          <div className="h-28 w-28 overflow-hidden rounded-full">
            <img
              src={viewedProfile.avatar || AVATAR_MOT_FOUND_IMG}
              alt={viewedProfile.name || "User"}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Кнопка '+' для зміни аватара — тільки на СВОЄМУ профілі */}
          {isMyProfile && (
            <button
              className="absolute -bottom-3 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-black text-white hover:bg-gray-800 transition-colors"
              type="button"
            >
              <span className="text-xl font-light leading-none mb-[2px]">+</span>
            </button>
          )}
        </div>

        {/* Ім'я */}
        <h2 className="mb-8 mt-2 text-xl font-bold uppercase tracking-wide text-black">
          {viewedProfile.name || "User name"}
        </h2>

        {/* Статистика */}
        <div className="grid w-full grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-[15px]">
          <span className="text-gray-400">Email:</span>
          <span className="font-semibold text-black truncate">{viewedProfile.email}</span>

          <span className="text-gray-400">Added recipes:</span>
          <span className="font-semibold text-black">{viewedProfile.recipesCount}</span>

          {/* Ці поля є ТІЛЬКИ у відповіді /users/me (мій профіль) */}
          {isMyProfile && (
            <>
              <span className="text-gray-400">Favorites:</span>
              <span className="font-semibold text-black">
                {(viewedProfile as MyProfile).favoritesCount}
              </span>
            </>
          )}

          <span className="text-gray-400">Followers:</span>
          <span className="font-semibold text-black">{viewedProfile.followersCount}</span>

          {/* Following — теж тільки у моєму профілі */}
          {isMyProfile && (
            <>
              <span className="text-gray-400">Following:</span>
              <span className="font-semibold text-black">
                {(viewedProfile as MyProfile).followingCount}
              </span>
            </>
          )}
        </div>
      </section>

      {/* Кнопка — вже визначена вище в actionButton */}
      {actionButton}
    </>
  );
}
