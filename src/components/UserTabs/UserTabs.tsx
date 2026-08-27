import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  decrementRecipeCount,
  decrementFavoriteCount,
} from "../../features/user/userSlice";
import { RecipePreview } from "../RecipePreview/RecipePreview";
import type { IRecipePreview } from "../RecipePreview/RecipePreview";
import { ListPagination } from "../ListPagination/ListPagination";
import { apiRequest } from "../../lib/apiClient";

type TabName = "recipes" | "favorites" | "followers" | "following";

interface PaginatedResponse {
  data?: IRecipePreview[];
  recipes?: IRecipePreview[];
  items?: IRecipePreview[];
  totalPages?: number;
  total?: number;
}

export function UserTabs() {
  const { id } = useParams<{ id: string }>();
  const isMyProfile = useAppSelector((state) => state.user.isMyProfile);
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<TabName>("recipes");

  const [recipes, setRecipes] = useState<IRecipePreview[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Reset page and tab when profile / id changes
  useEffect(() => {
    setPage(1);
  }, [activeTab, id]);

  const fetchRecipes = useCallback(
    async (currentPage: number) => {
      setIsLoading(true);
      try {
        let endpoint = "";
        if (activeTab === "recipes") {
          endpoint = isMyProfile ? "/recipes/own" : `/users/${id}/recipes`;
        } else if (activeTab === "favorites") {
          endpoint = "/recipes/favorites";
        }

        if (endpoint) {
          const res = await apiRequest<PaginatedResponse | IRecipePreview[]>(
            `${endpoint}?page=${currentPage}&limit=9`,
            { auth: true },
          );

          if (Array.isArray(res)) {
            setRecipes(res);
            setTotalPages(1);
          } else if (res && typeof res === "object") {
            const list = res.data || res.items || res.recipes || [];
            setRecipes(list);
            setTotalPages(res.totalPages || 1);
          }
        }
      } catch (error) {
        console.error("Failed to fetch recipes:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [activeTab, id, isMyProfile],
  );

  useEffect(() => {
    if (activeTab === "recipes" || activeTab === "favorites") {
      fetchRecipes(page);
    }
  }, [activeTab, page, fetchRecipes]);

  const handleDeleteRecipe = async (recipeId: string) => {
    try {
      if (activeTab === "recipes") {
        await apiRequest(`/recipes/${recipeId}`, { method: "DELETE", auth: true });
        dispatch(decrementRecipeCount());
      } else if (activeTab === "favorites") {
        await apiRequest(`/recipes/${recipeId}/favorite`, {
          method: "DELETE",
          auth: true,
        });
        dispatch(decrementFavoriteCount());
      }
      // If deleted the last item on the page, go to previous page if exists
      if (recipes.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        fetchRecipes(page);
      }
    } catch (error) {
      console.error("Failed to delete recipe:", error);
    }
  };

  const tabs = isMyProfile
    ? [
        { key: "recipes", label: "MY RECIPES" },
        { key: "favorites", label: "MY FAVORITES" },
        { key: "followers", label: "FOLLOWERS" },
        { key: "following", label: "FOLLOWING" },
      ]
    : [
        { key: "recipes", label: "RECIPES" },
        { key: "followers", label: "FOLLOWERS" },
      ];

  return (
    <div className="flex w-full flex-col">
      {/* Tab headers */}
      <div className="flex border-b border-gray-200 gap-2 sm:gap-6">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as TabName)}
              className={`relative pb-3 text-[14px] sm:text-[16px] font-bold uppercase transition-colors ${
                isActive ? "text-main" : "text-gray-400 hover:text-main"
              }`}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 h-[2px] w-full bg-main" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="mt-4 flex flex-col">
        {isLoading && (
          <div className="py-8 text-center text-gray-500">Loading recipes...</div>
        )}
        {!isLoading && (activeTab === "recipes" || activeTab === "favorites") && (
          <>
            {recipes.length > 0 ? (
              <div className="flex flex-col">
                {recipes.map((recipe) => (
                  <RecipePreview
                    key={recipe.id || recipe._id || Math.random().toString()}
                    recipe={recipe}
                    isOwner={isMyProfile}
                    onDelete={handleDeleteRecipe}
                  />
                ))}
              </div>
            ) : (
              <p className="py-8 text-gray-500">No recipes found.</p>
            )}
            <ListPagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}

        {/* Placeholders for followers/following */}
        {!isLoading && activeTab === "followers" && (
          <p className="text-gray-500">Followers list coming soon.</p>
        )}
        {!isLoading && activeTab === "following" && (
          <p className="text-gray-500">Following list coming soon.</p>
        )}
      </div>
    </div>
  );
}
