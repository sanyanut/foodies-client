import { Icon } from "../../shared/Icon/Icon.tsx";

/** Figma's desktop/tablet grid isn't a repeating pattern — each card is either
 *  "regular" or "wide", and which categories are wide differs between the two
 *  breakpoints (e.g. Lamb is wide on desktop but regular on tablet). Every row
 *  still adds up to the full container width, so plain `flex-wrap` with each
 *  card's explicit width wraps rows automatically — no manual row grouping
 *  needed. `desktopOnly` mirrors the Figma mobile frame, which only lists 8 of
 *  the 11 categories before the "All categories" card. */
interface Category {
  name: string;
  image: string;
  wideOnTablet?: boolean;
  wideOnDesktop?: boolean;
  desktopOnly?: boolean;
}

const CATEGORIES: Category[] = [
  { name: "Beef", image: "/images/categories/beef.jpg" },
  { name: "Breakfast", image: "/images/categories/breakfast.jpg" },
  {
    name: "Desserts",
    image: "/images/categories/desserts.jpg",
    wideOnTablet: true,
    wideOnDesktop: true,
  },
  { name: "Lamb", image: "/images/categories/lamb.jpg", wideOnDesktop: true },
  { name: "Goat", image: "/images/categories/goat.jpg" },
  { name: "Miscellaneous", image: "/images/categories/miscellaneous.jpg" },
  { name: "Pasta", image: "/images/categories/pasta.jpg" },
  {
    name: "Pork",
    image: "/images/categories/pork.jpg",
    wideOnTablet: true,
    wideOnDesktop: true,
  },
  { name: "Seafood", image: "/images/categories/seafood.jpg", desktopOnly: true },
  {
    name: "Side",
    image: "/images/categories/side.jpg",
    wideOnDesktop: true,
    desktopOnly: true,
  },
  { name: "Starter", image: "/images/categories/starter.jpg", desktopOnly: true },
];

// Widths are `calc()`-based percentages of the row, not the fixed px Figma
// shows, so a row always sums to exactly 100% regardless of the container's
// true available width — fixed px (342+342+20px gap = 704px) only fits a
// container that's *exactly* 704px, which breaks the moment a classic
// (non-overlay) scrollbar shaves a few px off it at precisely that
// breakpoint. Tablet is a clean 2-up row, so wide is just the full row and
// regular is half minus half the gap. Desktop's 3-up rows mix regular/wide
// in a non-2:1 ratio (325:590 in Figma), so those percentages are derived
// from that ratio instead of a round fraction.
//
// Tailwind v4 also emits arbitrary breakpoint variants (`min-[1440px]:`)
// *before* the standard `md:` block in the generated CSS regardless of pixel
// value, so at >=1440px an unmodified `md:` rule of equal specificity would
// win the cascade over this one — the trailing `!` forces it to win instead.
const cardWidth = (wideOnTablet?: boolean, wideOnDesktop?: boolean) =>
  `w-full ${wideOnTablet ? "md:w-full" : "md:w-[calc(50%-10px)]"} ${
    wideOnDesktop
      ? "min-[1440px]:w-[calc((100%-40px)*0.48)]!"
      : "min-[1440px]:w-[calc((100%-40px)*0.26)]!"
  }`;

interface CategoryListProps {
  onSelectCategory: (name: string) => void;
  onSelectAll: () => void;
}

const CategoryCard = ({
  name,
  image,
  wideOnTablet,
  wideOnDesktop,
  desktopOnly,
  onSelect,
}: Category & { onSelect: (name: string) => void }) => (
  <div
    className={`relative h-[250px] shrink-0 overflow-hidden rounded-[20px] md:h-[369px] md:rounded-[30px] ${cardWidth(wideOnTablet, wideOnDesktop)} ${desktopOnly ? "hidden md:block" : ""}`}
  >
    <img src={image} alt={name} className="h-full w-full object-cover" />
    <div className="absolute inset-0 bg-main/20" />
    <div className="absolute bottom-4 left-4 flex items-start gap-1 md:bottom-6 md:left-6">
      <span className="flex items-center justify-center rounded-full border border-white bg-white/20 px-3 py-2 text-[16px] font-bold leading-[24px] text-white tracking-[-0.32px] md:border-white/20 md:px-[14px] md:py-[9px] md:text-[20px] md:tracking-[-0.4px]">
        {name}
      </span>
      <button
        type="button"
        onClick={() => onSelect(name)}
        aria-label={`View ${name} recipes`}
        className="flex items-center justify-center rounded-full border border-white/20 p-[11px] text-white transition-transform hover:scale-110 active:scale-90 md:p-[12px] cursor-pointer"
      >
        <Icon name="arrow-up-right" className="h-[18px] w-[18px]" />
      </button>
    </div>
  </div>
);

export const CategoryList = ({ onSelectCategory, onSelectAll }: CategoryListProps) => (
  <div className="flex flex-wrap items-start gap-4 md:gap-5">
    {CATEGORIES.map((category) => (
      <CategoryCard key={category.name} {...category} onSelect={onSelectCategory} />
    ))}

    <button
      type="button"
      onClick={onSelectAll}
      className={`flex h-[250px] shrink-0 items-center justify-center rounded-[20px] bg-main text-[16px] cursor-pointer font-extrabold uppercase text-white tracking-[-0.32px] transition-colors hover:bg-dark md:h-[369px] md:rounded-[30px] md:text-[20px] md:tracking-[-0.4px] ${cardWidth()}`}
    >
      All categories
    </button>
  </div>
);
