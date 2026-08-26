/**
 * Компонент хлібних крихт (Breadcrumbs).
 *
 * Призначення:
 * - Відображає навігаційний ланцюжок "Home / <Поточна сторінка>".
 * - Забезпечує перехід на головну сторінку за кліком на "Home".
 * - Є універсальним: приймає назву поточної сторінки через проп `currentPage` (наприклад, "Add recipe", "Profile", "Desserts").
 */
import { Link } from "react-router-dom";

interface BreadcrumbsProps {
  currentPage: string;
}

export const Breadcrumbs = ({ currentPage }: BreadcrumbsProps) => {
  return (
    <nav
      aria-label="Breadcrumbs"
      className="mb-[32px] flex flex-wrap items-center gap-[8px] text-[12px] font-bold uppercase leading-[18px] tracking-[-0.24px] md:mb-[40px]"
    >
      <Link to="/" className="shrink-0 text-gray transition-colors hover:text-main">
        Home
      </Link>
      <span className="shrink-0 text-gray">/</span>
      <span className="break-words text-main">{currentPage}</span>
    </nav>
  );
};
