import React, { useState, useRef, useEffect, useMemo } from "react";
import type { RecipeLookup } from "../../features/recipes/types";
import { Spinner } from "../../shared/Spinner/Spinner.tsx";

interface RecipeSelectProps {
  label?: string;
  placeholder: string;
  options: RecipeLookup[];
  value: string; // id або name
  onChange: (option: RecipeLookup) => void;
  error?: string | boolean;
  className?: string;
  /** True while the options list is still being fetched (e.g. lookupsSlice
   *  status === "loading") — shown instead of "No options available" so an
   *  empty list mid-fetch doesn't read as a genuinely empty dictionary. */
  loading?: boolean;
}

export const RecipeSelect: React.FC<RecipeSelectProps> = ({
  label,
  placeholder,
  options,
  value,
  onChange,
  error,
  className = "",
  loading = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  // Клієнтський пошук по опціях (як у RecipeFilters на сторінці рецептів).
  const [query, setQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const selectedOption = options.find((opt) => opt.id === value || opt.name === value);

  const close = () => {
    setIsOpen(false);
    setQuery("");
  };

  // Закриття списку при кліку поза межами або клавішею Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        close();
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Фокус на поле пошуку при відкритті
  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const trimmedQuery = query.trim().toLowerCase();
  const filteredOptions = useMemo(
    () =>
      trimmedQuery
        ? options.filter((option) => option.name.toLowerCase().includes(trimmedQuery))
        : options,
    [options, trimmedQuery],
  );

  const handleSelect = (option: RecipeLookup) => {
    onChange(option);
    close();
  };

  return (
    <div className={`relative flex flex-col ${className}`} ref={dropdownRef}>
      {label && (
        <span className="mb-2 text-[16px] font-extrabold uppercase leading-6 tracking-[-0.32px] text-main md:mb-4 md:text-[20px] md:leading-6 md:tracking-[-0.4px]">
          {label}
        </span>
      )}

      {/* Кнопка вибору (додано клас group) */}
      <button
        type="button"
        disabled={loading}
        onClick={() => (isOpen ? close() : setIsOpen(true))}
        className={`group flex h-12 w-full items-center justify-between rounded-dropdown border bg-transparent px-3.5 text-[14px] leading-5 tracking-[-0.28px] transition-colors disabled:cursor-not-allowed disabled:opacity-50 md:h-14 md:px-4.5 md:text-[16px] md:leading-6 md:tracking-[-0.32px] ${
          error ? "border-[#AE0000]" : "border-gray hover:border-main"
        }`}
      >
        {/* Текст плейсхолдера: при ховері на батьківську кнопку стає чорним */}
        <span
          className={`truncate transition-colors duration-200 ${
            selectedOption ? "text-main" : "text-gray group-hover:text-main"
          }`}
        >
          {selectedOption ? selectedOption.name : placeholder}
        </span>

        {loading ? (
          <Spinner className="h-4.5 w-4.5 shrink-0 text-main" />
        ) : (
          <svg
            className={`h-4.5 w-4.5 shrink-0 text-main transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        )}
      </button>

      {/* Спливне вікно (Dropdown menu) з полем пошуку */}
      {isOpen && (
        <div className="absolute top-[calc(100%+6px)] z-50 w-full rounded-dropdown  border border-[#F0F0F0] bg-white p-4 shadow-lg">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search…"
            aria-label={`Search ${(label || placeholder).toLowerCase()}`}
            className="mb-3 w-full rounded-dropdown border border-gray/60 px-3.5 py-2 text-[14px] leading-5 text-main outline-none transition-colors placeholder:text-main focus:border-main md:text-[16px]"
          />

          <ul className="max-h-55 w-full overflow-y-auto">
            {loading ? (
              <li className="flex justify-center py-2">
                <Spinner className="h-4 w-4 text-gray" />
              </li>
            ) : options.length === 0 ? (
              <li className="py-2 text-center text-sm text-gray">No options available</li>
            ) : filteredOptions.length === 0 ? (
              <li className="py-2 text-center text-sm text-gray">No matches found</li>
            ) : (
              filteredOptions.map((option) => (
                <li key={option.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`w-full py-1.5 text-left text-[14px] font-medium leading-5 tracking-[-0.28px] transition-colors hover:text-main md:text-[16px] md:leading-6 md:tracking-[-0.32px] ${
                      selectedOption?.id === option.id
                        ? "font-bold text-main"
                        : "text-main"
                    }`}
                  >
                    {option.name}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}

      {/* Повідомлення про помилку */}
      {typeof error === "string" && (
        <span className="mt-1 text-xs font-medium text-[#AE0000]">{error}</span>
      )}
    </div>
  );
};
