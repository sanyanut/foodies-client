import { Container } from "../Container/Container.tsx";
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
  <Container
    as="section"
    aria-label="Categories"
    className="pt-16 pb-16 md:pt-20 md:pb-20 min-[1440px]:pt-24! min-[1440px]:pb-24!"
  >
    <MainTitle
      tag="h2"
      variant="category"
      title="Categories"
      description="Discover a limitless world of culinary possibilities and enjoy exquisite recipes that combine taste, style and the warm atmosphere of the kitchen."
    />
    <CategoryList onSelectCategory={onSelectCategory} onSelectAll={onSelectAll} />
  </Container>
);
