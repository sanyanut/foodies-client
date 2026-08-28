import React, { useState, useRef, useEffect } from "react";
import type { RecipeLookup } from "../../features/recipes/types";

interface RecipeSelectProps {
  label?: string;
  placeholder: string;
  options: RecipeLookup[];
  value: string; // id або name
  onChange: (option: RecipeLookup) => void;
  error?: string | boolean;
  className?: string;
}

export const RecipeSelect: React.FC<RecipeSelectProps> = ({
  label,
  placeholder,
  options,
  value,
  onChange,
  error,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const selectedOption = options.find((opt) => opt.id === value || opt.name === value);

  // Закриття списку при кліку поза межами
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: RecipeLookup) => {
    onChange(option);
    setIsOpen(false);
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
        onClick={() => setIsOpen((prev) => !prev)}
        className={`group flex h-12 w-full items-center justify-between rounded-dropdown border bg-transparent px-3.5 text-[14px] leading-5 tracking-[-0.28px] transition-colors md:h-14 md:px-4.5 md:text-[16px] md:leading-6 md:tracking-[-0.32px] ${
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

        {/* Шеврон */}
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
      </button>

      {/* Спливне вікно (Dropdown menu) */}
      {isOpen && (
        <ul className="absolute top-[calc(100%+6px)] z-50 max-h-55 w-full overflow-y-auto rounded-dropdown border border-[#F0F0F0] bg-white p-4 shadow-lg">
          {options.length === 0 ? (
            <li className="py-2 text-center text-sm text-gray">No options available</li>
          ) : (
            options.map((option) => (
              <li key={option.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`w-full py-1.5 text-left text-[14px] font-medium leading-5 tracking-[-0.28px] transition-colors hover:text-main md:text-[16px] md:leading-6 md:tracking-[-0.32px] ${
                    selectedOption?.id === option.id ? "font-bold text-main" : "text-gray"
                  }`}
                >
                  {option.name}
                </button>
              </li>
            ))
          )}
        </ul>
      )}

      {/* Повідомлення про помилку */}
      {typeof error === "string" && (
        <span className="mt-1 text-xs font-medium text-[#AE0000]">{error}</span>
      )}
    </div>
  );
};
