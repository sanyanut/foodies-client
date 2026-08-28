type PaginationItem = number | "start-ellipsis" | "end-ellipsis";

interface RecipePaginationProps {
  currentPage: number;
  totalPages: number;
  disabled?: boolean;
  onPageChange: (page: number) => void;
}

function getPaginationItems(currentPage: number, totalPages: number): PaginationItem[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "end-ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [
      1,
      "start-ellipsis",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "start-ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "end-ellipsis",
    totalPages,
  ];
}

export const RecipePagination = ({
  currentPage,
  totalPages,
  disabled = false,
  onPageChange,
}: RecipePaginationProps) => {
  if (totalPages <= 1) return null;

  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const items = getPaginationItems(safeCurrentPage, totalPages);

  return (
    <nav aria-label="Recipes pagination">
      <ul className="flex flex-wrap items-center justify-center gap-[4px]">
        {items.map((item) => {
          if (typeof item !== "number") {
            return (
              <li key={item}>
                <span
                  aria-hidden="true"
                  className="flex h-[40px] w-[40px] items-center justify-center text-[14px] text-gray"
                >
                  …
                </span>
              </li>
            );
          }

          const isCurrent = item === safeCurrentPage;

          return (
            <li key={item}>
              <button
                type="button"
                aria-label={`Go to page ${item}`}
                aria-current={isCurrent ? "page" : undefined}
                disabled={disabled || isCurrent}
                onClick={() => onPageChange(item)}
                className={`flex h-[40px] w-[40px] items-center justify-center rounded-full border text-[14px] font-medium leading-[20px] transition-colors disabled:cursor-default ${
                  isCurrent
                    ? "border-main text-main"
                    : "border-transparent text-gray hover:border-gray/60 hover:text-main"
                }`}
              >
                {item}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
