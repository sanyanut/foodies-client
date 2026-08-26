import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { MainTitle } from "../../components/MainTitle/MainTitle.tsx";
import { RecipeCard } from "../../components/RecipeCard/RecipeCard.tsx";
import { RecipeFilters } from "../../components/RecipeFilters/RecipeFilters.tsx";
import { RecipePagination } from "../../components/RecipePagination/RecipePagination.tsx";
import {
  getAreas,
  getCategories,
  getIngredients,
  getRecipes,
} from "../../features/recipes/recipesApi.ts";
import type { RecipeLookup, RecipesResponse } from "../../features/recipes/types.ts";

const PAGE_SIZE = 12;

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export const RecipesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get("category") ?? "";
  const ingredient = searchParams.get("ingredient") ?? "";
  const area = searchParams.get("area") ?? "";

  const pageParam = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const currentPage = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;

  const [ingredients, setIngredients] = useState<RecipeLookup[]>([]);
  const [areas, setAreas] = useState<RecipeLookup[]>([]);
  const [categories, setCategories] = useState<RecipeLookup[]>([]);
  const [catalog, setCatalog] = useState<RecipesResponse | null>(null);

  const [isFiltersLoading, setIsFiltersLoading] = useState(true);
  const [isRecipesLoading, setIsRecipesLoading] = useState(true);
  const [filtersError, setFiltersError] = useState<string | null>(null);
  const [recipesError, setRecipesError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    setIsFiltersLoading(true);
    setFiltersError(null);

    Promise.all([
      getIngredients(controller.signal),
      getAreas(controller.signal),
      getCategories(controller.signal),
    ])
      .then(([ingredientsData, areasData, categoriesData]) => {
        setIngredients(ingredientsData);
        setAreas(areasData);
        setCategories(categoriesData);
      })
      .catch((error: unknown) => {
        if (!isAbortError(error)) {
          setFiltersError(getErrorMessage(error, "Failed to load recipe filters."));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsFiltersLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    setIsRecipesLoading(true);
    setRecipesError(null);

    getRecipes(
      {
        category: category || undefined,
        ingredient: ingredient || undefined,
        area: area || undefined,
        page: currentPage,
        limit: PAGE_SIZE,
      },
      controller.signal,
    )
      .then(setCatalog)
      .catch((error: unknown) => {
        if (!isAbortError(error)) {
          setRecipesError(getErrorMessage(error, "Failed to load recipes."));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsRecipesLoading(false);
        }
      });

    return () => controller.abort();
  }, [area, category, currentPage, ingredient]);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [currentPage]);

  const selectedCategory = categories.find((option) => option.id === category);

  const pageTitle =
    selectedCategory?.name === "Dessert"
      ? "Desserts"
      : (selectedCategory?.name ?? "Recipes");

  const pageDescription =
    selectedCategory?.name === "Dessert"
      ? "Go on a taste journey, where every sip is a sophisticated creative blend, and every dessert is an expression of the most refined gastronomic desires."
      : "Discover delicious recipes and find inspiration for your next culinary creation.";

  const handleFilterChange = (key: "ingredient" | "area", value: string) => {
    const nextParams = new URLSearchParams(searchParams);

    if (value) nextParams.set(key, value);
    else nextParams.delete(key);

    nextParams.delete("page");
    setSearchParams(nextParams);
  };

  const handlePageChange = (nextPage: number) => {
    const nextParams = new URLSearchParams(searchParams);

    if (nextPage === 1) {
      nextParams.delete("page");
    } else {
      nextParams.set("page", String(nextPage));
    }

    setSearchParams(nextParams);
  };

  return (
    <section
      id="recipes-catalog"
      className="mx-auto w-full max-w-[1440px] px-[16px] py-[64px] md:px-[32px] lg:px-[80px] lg:py-[80px]"
    >
      <Link
        to="/"
        className="inline-flex text-[12px] font-bold uppercase leading-[18px] tracking-[-0.24px] transition-colors hover:text-gray"
      >
        ← Back
      </Link>

      <MainTitle
        title={pageTitle}
        description={pageDescription}
        variant="category"
        className="mt-[16px]"
      />

      <div className="grid items-start gap-[40px] lg:grid-cols-[330px_minmax(0,1fr)]">
        <div>
          <RecipeFilters
            ingredients={ingredients}
            areas={areas}
            ingredient={ingredient}
            area={area}
            disabled={isFiltersLoading || Boolean(filtersError)}
            onIngredientChange={(value) => handleFilterChange("ingredient", value)}
            onAreaChange={(value) => handleFilterChange("area", value)}
          />

          {filtersError && (
            <p role="alert" className="mt-[12px] text-[14px] leading-[20px] text-red-500">
              {filtersError}
            </p>
          )}
        </div>

        <div aria-busy={isRecipesLoading}>
          {isRecipesLoading && !catalog && (
            <p role="status" className="text-[14px] text-gray">
              Loading recipes…
            </p>
          )}

          {recipesError && (
            <p role="alert" className="text-[14px] text-red-500">
              {recipesError}
            </p>
          )}

          {catalog && !recipesError && (
            <>
              {catalog.data.length > 0 ? (
                <div
                  className={`grid grid-cols-1 gap-x-[20px] gap-y-[40px] transition-opacity md:grid-cols-2 xl:grid-cols-3 ${
                    isRecipesLoading ? "opacity-50" : "opacity-100"
                  }`}
                >
                  {catalog.data.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>
              ) : (
                <p className="text-[14px] text-gray">No recipes found.</p>
              )}

              <div className="mt-[60px]">
                <RecipePagination
                  currentPage={catalog.page}
                  totalPages={catalog.totalPages}
                  disabled={isRecipesLoading}
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
