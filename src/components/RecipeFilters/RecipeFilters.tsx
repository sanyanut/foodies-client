import type { ChangeEvent } from "react";

import type { RecipeLookup } from "../../features/recipes/types.ts";
import { Icon } from "../../shared/Icon/Icon.tsx";

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
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  };

  return (
    <label className="relative block w-full">
      <span className="sr-only">Filter by {label.toLowerCase()}</span>

      <select
        value={value}
        disabled={disabled}
        onChange={handleChange}
        className={`h-[56px] w-full appearance-none rounded-dropdown border border-gray/60 bg-white px-[18px] pr-[48px] text-[14px] font-medium leading-[20px] tracking-[-0.28px] outline-none transition-colors focus:border-main disabled:cursor-not-allowed disabled:opacity-50 ${
          value ? "text-main" : "text-gray"
        }`}
      >
        <option value="">{label}</option>

        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>

      <Icon
        name="chevron-down"
        className="pointer-events-none absolute right-[18px] top-1/2 h-[18px] w-[18px] -translate-y-1/2"
      />
    </label>
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
