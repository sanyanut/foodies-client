interface IListPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ListPagination({
  currentPage,
  totalPages,
  onPageChange,
}: IListPaginationProps) {
  if (totalPages <= 1) return null;

  // Create a limited window of pages to prevent overflow
  let startPage = Math.max(1, currentPage - 1);
  let endPage = Math.min(totalPages, currentPage + 1);

  if (currentPage === 1) {
    endPage = Math.min(totalPages, 3);
  } else if (currentPage === totalPages) {
    startPage = Math.max(1, totalPages - 2);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`flex h-10 w-10 items-center justify-center rounded-full border text-[14px] font-bold transition-colors ${
            page === currentPage
              ? "border-main bg-main text-white"
              : "border-gray-300 text-main hover:border-main"
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  );
}
