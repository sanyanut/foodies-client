import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  fetchTabRecipes,
  fetchTabUsers,
  deleteTabRecipe,
  toggleFollowUser,
  clearTabData,
  setTabCurrentPage,
} from "../../features/user/userSlice";
import { RecipePreview } from "../RecipePreview/RecipePreview";
import { FollowUserCard } from "../FollowUserCard/FollowUserCard";
import { ListPagination } from "../ListPagination/ListPagination";

type TabName = "recipes" | "favorites" | "followers" | "following";

const MY_TABS: { key: TabName; label: string }[] = [
  { key: "recipes", label: "MY RECIPES" },
  { key: "favorites", label: "MY FAVORITES" },
  { key: "followers", label: "FOLLOWERS" },
  { key: "following", label: "FOLLOWING" },
];

const PUBLIC_TABS: { key: TabName; label: string }[] = [
  { key: "recipes", label: "RECIPES" },
  { key: "followers", label: "FOLLOWERS" },
];

export function UserTabs() {
  const { id } = useParams<{ id: string }>();
  const isMyProfile = useAppSelector((state) => state.user.isMyProfile);
  const viewedProfile = useAppSelector((state) => state.user.viewedProfile);
  const authUser = useAppSelector((state) => state.auth.user);
  const { tabRecipes, tabUsers, tabCurrentPage, tabTotalPages, tabStatus, tabError } =
    useAppSelector((state) => state.user);

  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<TabName>("recipes");

  // Reset при переході між профілями
  useEffect(() => {
    setActiveTab("recipes");
    dispatch(clearTabData());
  }, [id, dispatch]);

  // Захист: чужий профіль не має вкладок "favorites" / "following"
  useEffect(() => {
    if (!isMyProfile && (activeTab === "favorites" || activeTab === "following")) {
      setActiveTab("recipes");
      dispatch(clearTabData());
    }
  }, [isMyProfile, activeTab, dispatch]);

  // Main fetch: runs when profile is available or dependencies change
  useEffect(() => {
    if (!viewedProfile) return;

    if (activeTab === "recipes" || activeTab === "favorites") {
      let endpoint: string;
      if (activeTab === "favorites") {
        endpoint = "/recipes/favorites";
      } else if (isMyProfile) {
        endpoint = "/recipes/own";
      } else {
        // id може бути undefined під час race condition при переході на /profile
        if (!id) return;
        endpoint = `/users/${id}/recipes`;
      }
      void dispatch(fetchTabRecipes({ endpoint, page: tabCurrentPage, limit: 9 }));
    } else {
      const targetId = isMyProfile ? authUser?.id : id;
      if (!targetId) return;

      const endpoint =
        activeTab === "following"
          ? "/users/me/following"
          : `/users/${targetId}/followers`;

      void dispatch(fetchTabUsers({ endpoint, page: tabCurrentPage, limit: 5 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: viewedProfile?.id instead of full object
  }, [
    activeTab,
    id,
    isMyProfile,
    viewedProfile?.id,
    authUser?.id,
    tabCurrentPage,
    dispatch,
  ]);

  // ─── Handlers ────────────────────────────────────────────────────────────

  const handleTabChange = (tab: TabName) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    dispatch(clearTabData());
  };

  const handleDeleteRecipe = (recipeId: string) => {
    void dispatch(
      deleteTabRecipe({ recipeId, isFavorite: activeTab === "favorites" }),
    ).then((result) => {
      if (result.meta.requestStatus !== "fulfilled") return;
      if (tabRecipes.length === 1 && tabCurrentPage > 1) {
        dispatch(setTabCurrentPage(tabCurrentPage - 1));
      }
    });
  };

  const handleToggleFollow = (targetUserId: string, isFollowed: boolean) => {
    void dispatch(
      toggleFollowUser({
        targetUserId,
        isFollowed,
        isFollowingTab: activeTab === "following",
      }),
    ).then((result) => {
      if (result.meta.requestStatus !== "fulfilled") return;
      if (
        activeTab === "following" &&
        isFollowed &&
        tabUsers.length === 1 &&
        tabCurrentPage > 1
      ) {
        dispatch(setTabCurrentPage(tabCurrentPage - 1));
      }
    });
  };

  // ─── Render ──────────────────────────────────────────────────────────────

  const tabs = isMyProfile ? MY_TABS : PUBLIC_TABS;
  const isRecipeTab = activeTab === "recipes" || activeTab === "favorites";
  const isLoading = tabStatus === "loading";
  const showContent = !isLoading && !tabError;

  const pagination = (
    <ListPagination
      currentPage={tabCurrentPage}
      totalPages={tabTotalPages}
      onPageChange={(page) => dispatch(setTabCurrentPage(page))}
    />
  );

  return (
    <div className="flex w-full flex-col">
      {/* Tab headers */}
      <div className="flex border-b border-gray-200 gap-4 sm:gap-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map(({ key, label }) => (
          <button
            type="button"
            key={key}
            onClick={() => handleTabChange(key)}
            className={`relative shrink-0 whitespace-nowrap pb-3 text-[14px] sm:text-[16px] font-bold uppercase transition-colors cursor-pointer ${
              activeTab === key ? "text-main" : "text-gray-400 hover:text-main"
            }`}
          >
            {label}
            {activeTab === key && (
              <span className="absolute bottom-0 left-0 h-[2px] w-full bg-main" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-4 flex flex-col">
        {isLoading && <div className="py-8 text-center text-gray-500">Loading...</div>}
        {tabError && <div className="py-8 text-center text-red-500">{tabError}</div>}

        {showContent && isRecipeTab && (
          <>
            {tabRecipes.length > 0 ? (
              <div className="flex flex-col">
                {tabRecipes.map((recipe, index) => (
                  <RecipePreview
                    key={recipe.id ?? recipe._id ?? index}
                    recipe={recipe}
                    isOwner={isMyProfile}
                    onDelete={handleDeleteRecipe}
                  />
                ))}
              </div>
            ) : (
              <p className="py-8 text-gray-500">No recipes found.</p>
            )}
            {pagination}
          </>
        )}

        {showContent && !isRecipeTab && (
          <>
            {tabUsers.length > 0 ? (
              <div className="flex flex-col">
                {tabUsers.map((user) => (
                  <FollowUserCard
                    key={user.id}
                    user={user}
                    onToggleFollow={handleToggleFollow}
                  />
                ))}
              </div>
            ) : (
              <p className="py-8 text-gray-500">No users found.</p>
            )}
            {pagination}
          </>
        )}
      </div>
    </div>
  );
}
