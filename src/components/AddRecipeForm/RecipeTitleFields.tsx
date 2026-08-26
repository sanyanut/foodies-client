/**
 * Блок полів введення назви та опису рецепта.
 *
 * Призначення:
 * - Поле `title`: введення назви рецепта великими літерами (uppercase).
 * - Поле `description`: введення короткого опису страви з обмеженням та динамічним лічильником символів (0/200).
 * - Візуальна валідація: у разі помилки плейсхолдер, лічильник та нижня лінія фарбуються у червоний колір без виведення додаткового тексту помилки.
 */
import { useFormContext } from "react-hook-form";
import type { RecipeFormData } from "./AddRecipeForm";

export const RecipeTitleFields = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<RecipeFormData>();

  // Поточне значення лічильника символів
  const description = watch("description") || "";
  const isTitleError = Boolean(errors.title);
  const isDescriptionError = Boolean(errors.description);

  return (
    <div className="flex flex-col gap-[32px] md:gap-[40px]">
      {/* 1. Поле назви рецепта (Title) */}
      <div className="relative w-full">
        <input
          type="text"
          placeholder="THE NAME OF THE RECIPE"
          {...register("title", { required: true })}
          className={`w-full bg-transparent pb-[14px] text-[14px] font-bold uppercase tracking-[-0.28px] outline-none transition-colors md:text-[16px] md:tracking-[-0.32px] ${
            isTitleError
              ? "text-red-500 placeholder:text-red-500"
              : "text-main placeholder:text-gray focus:placeholder-transparent"
          }`}
        />
      </div>

      {/* 2. Поле опису страви (Description з лічильником 0/200) */}
      <div className="relative w-full">
        <div className="flex items-center justify-between gap-2 pb-[14px]">
          <input
            type="text"
            maxLength={200}
            placeholder="Enter a description of the dish"
            {...register("description", { required: true, maxLength: 200 })}
            className={`w-full bg-transparent text-[14px] leading-[20px] tracking-[-0.28px] outline-none transition-colors md:text-[16px] md:leading-[24px] md:tracking-[-0.32px] ${
              isDescriptionError
                ? "text-red-500 placeholder:text-red-500"
                : "text-main placeholder:text-gray"
            }`}
          />

          {/* Лічильник символів */}
          <span
            className={`shrink-0 text-[12px] leading-[18px] tracking-[-0.24px] md:text-[14px] md:leading-[20px] ${
              isDescriptionError ? "text-red-500" : "text-gray"
            }`}
          >
            {description.length}/200
          </span>
        </div>

        {/* Нижня лінія */}
        <div
          className={`h-[1px] w-full transition-colors ${
            isDescriptionError ? "bg-red-500" : "bg-gray/60"
          }`}
        />
      </div>
    </div>
  );
};
