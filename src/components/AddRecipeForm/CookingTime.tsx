import React from "react";
import { useFormikContext } from "formik";
import { Icon } from "../../shared/Icon/Icon";
import type { RecipeFormValues } from "./recipeValidationSchema";

const MIN_TIME = 1;
const MAX_TIME = 995;
const STEP = 5;

export const CookingTime: React.FC = () => {
  const { values, setFieldValue } = useFormikContext<RecipeFormValues>();

  const isMin = values.time <= MIN_TIME;
  const isMax = values.time >= MAX_TIME;

  const handleDecrement = () => {
    if (isMin) return;

    if (values.time <= STEP) {
      setFieldValue("time", MIN_TIME);
    } else {
      setFieldValue("time", values.time - STEP);
    }
  };

  const handleIncrement = () => {
    if (isMax) return;

    if (values.time < STEP) {
      setFieldValue("time", STEP);
    } else {
      setFieldValue("time", Math.min(MAX_TIME, values.time + STEP));
    }
  };

  return (
    <div className="flex flex-col">
      {/* Заголовок секції */}
      <span className="mb-2 text-[16px] font-extrabold uppercase leading-6 tracking-[-0.32px] text-main md:mb-4 md:text-[20px] md:leading-6 md:tracking-[-0.4px]">
        Cooking time
      </span>

      <div className="flex h-12 items-center gap-3 md:h-14 md:gap-4">
        {/* Кнопка Мінус (-) */}
        <button
          type="button"
          onClick={handleDecrement}
          disabled={isMin}
          className={`group flex h-12 w-12 shrink-0 items-center justify-center rounded-full border bg-transparent transition-colors duration-200 md:h-14 md:w-14 ${
            isMin
              ? "cursor-not-allowed border-gray opacity-40"
              : "border-gray hover:border-main"
          }`}
          aria-label="Decrease cooking time"
        >
          <Icon
            name="minus"
            className={`h-4 w-4 transition-colors duration-200 md:h-6 md:w-6 ${
              isMin ? "text-gray" : "text-main group-hover:text-main"
            }`}
          />
        </button>

        {/* Значення часу */}
        <span
          className={`min-w-12.5 text-center text-[14px] font-medium leading-5 tracking-[-0.28px] md:text-[16px] md:leading-6 md:tracking-[-0.32px] ${
            values.time > 1 ? "text-main" : "text-gray"
          }`}
        >
          {values.time} min
        </span>

        {/* Кнопка Плюс (+) */}
        <button
          type="button"
          onClick={handleIncrement}
          disabled={isMax}
          className={`group flex h-12 w-12 shrink-0 items-center justify-center rounded-full border bg-transparent transition-colors duration-200 md:h-14 md:w-14 ${
            isMax
              ? "cursor-not-allowed border-gray opacity-40"
              : "border-gray hover:border-main"
          }`}
          aria-label="Increase cooking time"
        >
          <Icon
            name="plus"
            className={`h-4 w-4 transition-colors duration-200 md:h-6 md:w-6 ${
              isMax ? "text-gray" : "text-main group-hover:text-main"
            }`}
          />
        </button>
      </div>
    </div>
  );
};
