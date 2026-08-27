import { MainTitle } from "../MainTitle/MainTitle.tsx";
import { CategoryList } from "../CategoryList/CategoryList.tsx";

/** HomePage "Categories" section: title + description (via the shared MainTitle
 *  "category" variant) and the category card grid. Selecting a category (or "All
 *  categories") bubbles up so HomePage can swap this section for Recipes. */
interface CategoriesProps {
  onSelectCategory: (name: string) => void;
  onSelectAll: () => void;
}

export const Categories = ({ onSelectCategory, onSelectAll }: CategoriesProps) => (
  <section
    aria-label="Categories"
    className="mx-auto w-full max-w-[1440px] px-[16px] pb-16 pt-16 md:px-[32px] md:pb-20 md:pt-20 lg:px-[80px] lg:pb-24 lg:pt-24"
  >
    <MainTitle
      tag="h2"
      variant="category"
      title="Categories"
      description="Discover a limitless world of culinary possibilities and enjoy exquisite recipes that combine taste, style and the warm atmosphere of the kitchen."
    />
    <CategoryList onSelectCategory={onSelectCategory} onSelectAll={onSelectAll} />
  </section>
);
