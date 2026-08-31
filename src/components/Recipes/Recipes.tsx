import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

import { useAppDispatch, useAppSelector } from "../../store/hooks.ts";
import { fetchLookups } from "../../features/recipes/lookupsSlice.ts";
import { fetchFavorites } from "../../features/recipes/favoritesSlice.ts";
import { getRecipes } from "../../features/recipes/recipesApi.ts";
import type { RecipesResponse } from "../../features/recipes/types.ts";
import { MainTitle } from "../MainTitle/MainTitle.tsx";
import { RecipeFilters } from "../RecipeFilters/RecipeFilters.tsx";
import { RecipeList } from "../RecipeList/RecipeList.tsx";
import { RecipePagination } from "../RecipePagination/RecipePagination.tsx";
import { containerClass } from "../Container/Container.tsx";
import { Icon } from "../../shared/Icon/Icon.tsx";

const PAGE_SIZE = 12;

/**
 * Recipes catalog (ТЗ): shown in place of Categories after a category is picked.
 * Back → return to Categories. Title is the chosen category name (or "All
 * categories"). Contains RecipeFilters + RecipeList + RecipePagination; changing
 * a filter or the category resets the page to 1 and refetches with every param.
 */
interface RecipesProps {
  /** Chosen category display name, or null for "All categories". */
  categoryName: string | null;
  onBack: () => void;
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}

export const Recipes = ({ categoryName, onBack }: RecipesProps) => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const {
    categories,
    ingredients,
    areas,
    status: lookupsStatus,
    error: lookupsError,
  } = useAppSelector((state) => state.lookups);

  const [ingredient, setIngredient] = useState("");
  const [area, setArea] = useState("");
  const [page, setPage] = useState(1);

  const [catalog, setCatalog] = useState<RecipesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sectionRef = useRef<HTMLElement>(null);

  // Show the catalog from its top when it replaces Categories, so the swap is a
  // clean scroll to the Recipes heading instead of the page jumping to a clamped
  // scroll position. Runs before paint to avoid a flash. Hero stays in the DOM.
  useLayoutEffect(() => {
    sectionRef.current?.scrollIntoView({ block: "start" });
  }, []);

  // Cache ingredients/areas/categories in the store once.
  useEffect(() => {
    void dispatch(fetchLookups());
  }, [dispatch]);

  // Load the user's favorites so cards can show the accent heart.
  useEffect(() => {
    if (isAuthenticated) void dispatch(fetchFavorites());
  }, [dispatch, isAuthenticated]);

  // Resolve the chosen category name → backend id (the API filters by id).
  const categoryId = useMemo(() => {
    if (!categoryName) return undefined;
    const target = categoryName.toLowerCase();
    const singular = target.replace(/s$/, "");
    const match = categories.find(
      (item) =>
        item.name.toLowerCase() === target || item.name.toLowerCase() === singular,
    );
    return match?.id;
  }, [categoryName, categories]);

  const lookupsReady = lookupsStatus === "ready";
  // A named category needs the lookups loaded first (to know its id).
  const canFetch = categoryName === null || lookupsReady;

  // Category change resets to the first page.
  useEffect(() => {
    setPage(1);
  }, [categoryName]);

  const handleIngredientChange = (value: string) => {
    setIngredient(value);
    setPage(1);
  };

  const handleAreaChange = (value: string) => {
    setArea(value);
    setPage(1);
  };

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    // Scroll back to the top of the block so the loading state is visible.
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    if (!canFetch) return;

    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    getRecipes(
      {
        category: categoryId,
        ingredient: ingredient || undefined,
        area: area || undefined,
        page,
        limit: PAGE_SIZE,
      },
      controller.signal,
    )
      .then(setCatalog)
      .catch((requestError: unknown) => {
        if (!isAbortError(requestError)) {
          const message =
            requestError instanceof Error
              ? requestError.message
              : "Failed to load recipes.";
          setError(message);
          toast.error(message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [canFetch, categoryId, ingredient, area, page]);

  const title = categoryName ?? "All categories";

  // Shared spinner for both the initial (category → Recipes) load and the
  // pagination overlay, so the loading indicator is consistent.
  const spinner = (
    <Icon name="loader" className="h-12 w-12 animate-spin text-main md:h-14 md:w-14" />
  );

  return (
    <section
      ref={sectionRef}
      aria-label="Recipes"
      className={`${containerClass} pb-16 pt-[32px] md:pb-20`}
    >
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-[4px] md:gap-[6px] text-[12px] text-main md:text-[14px] font-bold uppercase leading-[16px] md:leading-[18px] tracking-[-0.24px] transition-colors hover:text-gray cursor-pointer"
      >
        <Icon name="arrow-left" className="h-4 w-4" />
        Back
      </button>

      <MainTitle
        tag="h2"
        variant="category"
        title={title}
        description="Discover delicious recipes and find inspiration for your next culinary creation."
        className="mt-[16px]"
      />

      <div className="grid min-h-screen items-start gap-[40px] min-[1440px]:grid-cols-[330px_minmax(0,1fr)]">
        <div>
          <RecipeFilters
            ingredients={ingredients}
            areas={areas}
            ingredient={ingredient}
            area={area}
            disabled={!lookupsReady || Boolean(lookupsError)}
            onIngredientChange={handleIngredientChange}
            onAreaChange={handleAreaChange}
          />

          {lookupsError && (
            <p role="alert" className="mt-[12px] text-[14px] leading-[20px] text-red-500">
              {lookupsError}
            </p>
          )}
        </div>

        <div aria-busy={isLoading}>
          {isLoading && !catalog && (
            <div role="status" aria-label="Loading recipes" className="min-h-[70vh]">
              <div className="sticky top-[45vh] flex justify-center">{spinner}</div>
              <span className="sr-only">Loading recipes…</span>
            </div>
          )}

          {error && (
            <p role="alert" className="text-[14px] text-red-500">
              {error}
            </p>
          )}

          {catalog && !error && (
            <>
              {catalog.data.length > 0 ? (
                <div className="relative">
                  <RecipeList
                    recipes={catalog.data}
                    className={`transition-opacity ${
                      isLoading ? "pointer-events-none opacity-40" : "opacity-100"
                    }`}
                  />

                  {/* Pagination loader: covers the (dimmed, non-clickable) list so
                      stale recipes can't be opened while the next page loads.
                      Centered over the block, and `sticky` keeps the spinner in
                      view when the list is taller than the viewport. */}
                  {isLoading && (
                    <div
                      role="status"
                      aria-label="Loading recipes"
                      className="absolute inset-0 z-10 bg-white/50"
                    >
                      <div className="sticky top-[45vh] flex justify-center">
                        {spinner}
                      </div>
                      <span className="sr-only">Loading recipes…</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-[14px] text-gray">No recipes found.</p>
              )}

              <div className="mt-[60px]">
                <RecipePagination
                  currentPage={catalog.page}
                  totalPages={catalog.totalPages}
                  disabled={isLoading}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
