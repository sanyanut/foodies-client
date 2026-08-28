import { useState } from "react";

import { Hero } from "../../fragments/Hero/Hero.tsx";
import { Categories } from "../../components/Categories/Categories.tsx";
import { Recipes } from "../../components/Recipes/Recipes.tsx";
import { Testimonials } from "../../fragments/Testimonials/Testimonials.tsx";

/**
 * HomePage: Hero (always) + either the Categories grid or the Recipes catalog.
 * Picking a category (or "All categories") swaps Categories for Recipes in place;
 * Back swaps them back. Recipes reserves its height while loading so the page
 * doesn't collapse and jump during the swap. `selected` holds the chosen
 * category name (null = "All categories"); `undefined` = Categories grid.
 */
export const HomePage = () => {
  const [selected, setSelected] = useState<string | null | undefined>(undefined);

  return (
    <>
      <Hero />
      {selected === undefined ? (
        <Categories
          onSelectCategory={(name) => setSelected(name)}
          onSelectAll={() => setSelected(null)}
        />
      ) : (
        <Recipes categoryName={selected} onBack={() => setSelected(undefined)} />
      )}
      <Testimonials />
    </>
  );
};
