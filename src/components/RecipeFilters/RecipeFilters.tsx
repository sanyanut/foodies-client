import { useEffect, useMemo, useRef, useState } from "react";

import type { RecipeLookup } from "../../features/recipes/types.ts";
import { Icon } from "../../shared/Icon/Icon.tsx";

/**
 * Custom styled dropdown (Figma) with client-side search — a native <select>
 * can't style its option list, so this renders its own button + a searchable
 * listbox: white rounded card, black options, scrollable, and a search field
 * that filters the options as the user types. Closes on select, outside click,
 * and Escape.
 */
interface FilterSelectProps {
  label: string;
  value: string;
  options: RecipeLookup[];
  disabled?: boolean;
  onChange: (value: string) => void;
}

const FilterSelect = ({
  label,
  value,
  options,
  disabled = false,
  onChange,
}: FilterSelectProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        close();
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (disabled) close();
  }, [disabled]);

  // Focus the search field when the dropdown opens.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const selected = options.find((option) => option.id === value);
  const displayText = selected ? selected.name : label;

  const trimmedQuery = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      trimmedQuery
        ? options.filter((option) => option.name.toLowerCase().includes(trimmedQuery))
        : options,
    [options, trimmedQuery],
  );

  const select = (id: string) => {
    onChange(id);
    close();
  };

  const optionClass = (isSelected: boolean) =>
    `w-full cursor-pointer rounded-[10px] px-[14px] py-[10px] text-left text-[14px] leading-[20px] tracking-[-0.28px] text-main transition-colors hover:bg-gray/15 ${
      isSelected ? "font-bold" : "font-medium"
    }`;

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Filter by ${label.toLowerCase()}`}
        onClick={() => (open ? close() : setOpen(true))}
        className={`flex h-[56px] w-full items-center justify-between gap-2 rounded-[15px] border bg-white px-[18px] text-left text-[14px] font-medium leading-[20px] tracking-[-0.28px] outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
          open ? "border-main" : "border-gray/60"
        }`}
      >
        <span className={`truncate ${selected ? "text-main" : "text-gray"}`}>
          {displayText}
        </span>
        <Icon
          name="chevron-down"
          className={`h-[18px] w-[18px] shrink-0 text-main transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-30 w-full rounded-[15px] border border-gray/40 bg-white p-2 shadow-[0_8px_30px_rgba(5,5,5,0.12)]">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Search ${label.toLowerCase()}…`}
            aria-label={`Search ${label.toLowerCase()}`}
            className="mb-2 w-full rounded-[10px] border border-gray/40 px-[14px] py-[8px] text-[14px] text-main outline-none placeholder:text-gray focus:border-main"
          />

          <ul
            role="listbox"
            aria-label={`${label} options`}
            className="max-h-[240px] overflow-auto"
          >
            {!trimmedQuery && (
              <li>
                <button
                  type="button"
                  role="option"
                  aria-selected={value === ""}
                  onClick={() => select("")}
                  className={optionClass(value === "")}
                >
                  {label}
                </button>
              </li>
            )}

            {filtered.length > 0 ? (
              filtered.map((option) => (
                <li key={option.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={option.id === value}
                    onClick={() => select(option.id)}
                    className={optionClass(option.id === value)}
                  >
                    {option.name}
                  </button>
                </li>
              ))
            ) : (
              <li className="px-[14px] py-[10px] text-[14px] text-gray">
                No matches found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

interface RecipeFiltersProps {
  ingredients: RecipeLookup[];
  areas: RecipeLookup[];
  ingredient: string;
  area: string;
  disabled?: boolean;
  className?: string;
  onIngredientChange: (value: string) => void;
  onAreaChange: (value: string) => void;
}

export const RecipeFilters = ({
  ingredients,
  areas,
  ingredient,
  area,
  disabled = false,
  className = "",
  onIngredientChange,
  onAreaChange,
}: RecipeFiltersProps) => (
  <div className={`flex w-full flex-col gap-[14px] md:max-w-[330px] ${className}`}>
    <FilterSelect
      label="Ingredients"
      value={ingredient}
      options={ingredients}
      disabled={disabled}
      onChange={onIngredientChange}
    />

    <FilterSelect
      label="Area"
      value={area}
      options={areas}
      disabled={disabled}
      onChange={onAreaChange}
    />
  </div>
);
