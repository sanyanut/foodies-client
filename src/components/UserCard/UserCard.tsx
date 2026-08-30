import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { LongButton } from "../../fragments/LongButton/LongButton";
import { openModal } from "../../features/ui/modalSlice.ts";
import { useAppDispatch, useAppSelector } from "../../store/hooks.ts";
import { AVATAR_MOT_FOUND_IMG } from "../../shared/constants.ts";
import { Icon } from "../../shared/Icon/Icon.tsx";
import {
  clearViewedProfile,
  fetchMyProfile,
  fetchPublicProfile,
  toggleFollowUser,
  type MyProfile,
} from "../../features/user/userSlice.ts";

export function UserCard() {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const authUserId = useAppSelector((state) => state.auth.user?.id);
  const { viewedProfile, isMyProfile, status } = useAppSelector((state) => state.user);

  useEffect(() => {
    // authUserId === undefined означає що токен ще перевіряється — чекаємо
    if (authUserId === undefined) return;

    if (id && id !== authUserId) {
      dispatch(fetchPublicProfile(id));
    } else {
      dispatch(fetchMyProfile());
    }

    return () => {
      dispatch(clearViewedProfile());
    };
  }, [dispatch, id, authUserId]);

  if (status === "loading" || !viewedProfile) {
    return (
      <div
        role="status"
        className="flex min-h-[320px] w-full max-w-[349px] items-center justify-center rounded-[32px] border border-gray-200 bg-white text-gray-400"
      >
        <Icon name="loader" className="h-12 w-12 animate-spin" />
        <span className="sr-only">Loading profile...</span>
      </div>
    );
  }

  const isFollowed = "isFollowedByMe" in viewedProfile && viewedProfile.isFollowedByMe;

  const handleFollowToggle = () => {
    if (!id) return;
    void dispatch(
      toggleFollowUser({ targetUserId: id, isFollowed, isFollowingTab: false }),
    );
  };

  let actionButton: React.ReactNode;
  if (isMyProfile) {
    actionButton = (
      <LongButton variant="solid" onClick={() => dispatch(openModal("logout"))}>
        Log Out
      </LongButton>
    );
  } else if (isFollowed) {
    actionButton = (
      <LongButton variant="outline" onClick={handleFollowToggle}>
        Unfollow
      </LongButton>
    );
  } else {
    actionButton = (
      <LongButton variant="solid" onClick={handleFollowToggle}>
        Follow
      </LongButton>
    );
  }

  return (
    <>
      <section className="w-full max-w-[349px] flex flex-col items-center rounded-[32px] border border-gray-200 px-[40px] md:px-[80px] py-[40px] mb-[20px] bg-white">
        {/* Аватарка */}
        <div className="relative mb-6">
          <div className="h-28 w-28 overflow-hidden rounded-full">
            <img
              src={viewedProfile.avatar ?? AVATAR_MOT_FOUND_IMG}
              alt={viewedProfile.name || "User"}
              className="h-full w-full object-cover"
            />
          </div>

          {isMyProfile && (
            <button
              type="button"
              onClick={() => dispatch(openModal("update-avatar"))}
              className="absolute -bottom-3 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-black text-white hover:bg-gray-800 transition-colors cursor-pointer"
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
        <dl className="grid w-full grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-[15px]">
          <dt className="text-gray-400">Email:</dt>
          <dd className="font-semibold text-black truncate">{viewedProfile.email}</dd>

          <dt className="text-gray-400">Added recipes:</dt>
          <dd className="font-semibold text-black">{viewedProfile.recipesCount}</dd>

          {isMyProfile && (
            <>
              <dt className="text-gray-400">Favorites:</dt>
              <dd className="font-semibold text-black">
                {(viewedProfile as MyProfile).favoritesCount}
              </dd>
            </>
          )}

          <dt className="text-gray-400">Followers:</dt>
          <dd className="font-semibold text-black">{viewedProfile.followersCount}</dd>

          {isMyProfile && (
            <>
              <dt className="text-gray-400">Following:</dt>
              <dd className="font-semibold text-black">
                {(viewedProfile as MyProfile).followingCount}
              </dd>
            </>
          )}
        </dl>
      </section>

      <div className="w-full max-w-[349px] cursor-pointer">{actionButton}</div>
    </>
  );
}
