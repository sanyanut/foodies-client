import { useFormikContext } from "formik";
import { FormTextarea } from "./FormTextarea";
import type { RecipeFormValues } from "./recipeValidationSchema";

/**
 * Блок полів введення назви та короткого опису рецепта.
 *
 * - Поле `title`: заголовок страви (без нижньої лінії, плейсхолдер темніє при наведенні та зникає при фокусі).
 * - Поле `description`: короткий опис (до 200 символів) через універсальний `FormTextarea`.
 */
export const RecipeTitleFields = () => {
  const { values, errors, touched, handleChange, handleBlur } =
    useFormikContext<RecipeFormValues>();

  const isTitleError = Boolean(touched.title && errors.title);

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      {/* 1. Назва рецепта */}
      <div className="relative w-full">
        <input
          type="text"
          name="title"
          value={values.title}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="THE NAME OF THE RECIPE"
          maxLength={100}
          className={`w-full bg-transparent pb-1 text-[18px] font-extrabold uppercase leading-6 tracking-[-0.36px] outline-none transition-colors duration-200 placeholder:transition-colors focus:placeholder:text-transparent md:text-[24px] md:leading-7 md:tracking-[-0.48px] ${
            isTitleError
              ? "text-[#AE0000] caret-[#AE0000] placeholder:text-[#AE0000]"
              : "text-main caret-main placeholder:text-gray hover:placeholder:text-main"
          }`}
        />
        {isTitleError && (
          <span className="mt-1 block text-xs font-medium text-[#AE0000]">
            {errors.title}
          </span>
        )}
      </div>

      {/* 2. Опис страви */}
      <FormTextarea
        name="description"
        placeholder="Enter a description of the dish"
        maxLength={200}
      />
    </div>
  );
};
