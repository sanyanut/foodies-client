import React, { useState } from "react";
import { useFormikContext } from "formik";
import { useAppSelector } from "../../store/hooks";
import { RecipeSelect } from "./RecipeSelect";
import { Icon } from "../../shared/Icon/Icon";
import type { RecipeFormValues, AddedIngredient } from "./recipeValidationSchema";

/** Added-ingredient thumbnail styled like the RecipeDetails ingredient box, but
 *  Tailwind-only: a bordered rounded frame holding the image (object-contain).
 *  Falls back to the 🥗 emoji when there is no URL or the image fails to load. */
const IngredientThumb: React.FC<{ src?: string; name: string }> = ({ src, name }) => {
  const [failed, setFailed] = useState(false);

  const box =
    "h-[75px] w-[75px] shrink-0 rounded-[18px] border border-[#E0E0E0] md:h-[90px] md:w-[90px] md:rounded-[15px]";

  if (!src || failed) {
    return (
      <div
        aria-hidden="true"
        className={`flex items-center justify-center bg-[#F4F4F4] text-[22px] md:text-[26px] ${box}`}
      >
        🥗
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`bg-white object-contain p-[6px] ${box}`}
    />
  );
};

export const RecipeIngredients: React.FC = () => {
  const { values, setFieldValue, setFieldError, setFieldTouched, errors, touched } =
    useFormikContext<RecipeFormValues>();

  const ingredientsOptions = useAppSelector((state) => state.lookups.ingredients);
  const ingredientsLoading = useAppSelector(
    (state) => state.lookups.status === "loading",
  );

  const isMeasureError = Boolean(touched.currentMeasure && errors.currentMeasure);
  const isIngredientError = Boolean(
    touched.currentIngredientId && errors.currentIngredientId,
  );
  // Помилка якщо масив порожній при сабміті
  const isListError = Boolean(
    touched.ingredients && errors.ingredients && values.ingredients.length === 0,
  );

  // Додавання інгредієнта в масив
  const handleAddIngredient = () => {
    let hasError = false;

    if (!values.currentIngredientId) {
      setFieldTouched("currentIngredientId", true, false);
      setFieldError("currentIngredientId", "Please select an ingredient");
      hasError = true;
    }

    if (!values.currentMeasure.trim()) {
      setFieldTouched("currentMeasure", true, false);
      setFieldError("currentMeasure", "Please enter quantity (e.g. 400 g)");
      hasError = true;
    }

    if (hasError) return;

    const selectedOption = ingredientsOptions.find(
      (item) => item.id === values.currentIngredientId,
    );

    if (!selectedOption) return;

    const isAlreadyAdded = values.ingredients.some(
      (item) => item.id === selectedOption.id,
    );

    if (isAlreadyAdded) {
      setFieldTouched("currentIngredientId", true, false);
      setFieldError("currentIngredientId", "This ingredient is already in the list");
      return;
    }

    const newItem: AddedIngredient = {
      id: selectedOption.id,
      name: selectedOption.name,
      measure: values.currentMeasure.trim(),
      img: selectedOption.img,
    };

    setFieldValue("ingredients", [...values.ingredients, newItem], false);
    setFieldValue("currentIngredientId", "", false);
    setFieldValue("currentMeasure", "", false);
    setFieldTouched("currentMeasure", false, false);
    setFieldTouched("currentIngredientId", false, false);
    setFieldError("ingredients", undefined);
  };

  const handleRemoveIngredient = (idToRemove: string) => {
    const updatedList = values.ingredients.filter((item) => item.id !== idToRemove);
    setFieldValue("ingredients", updatedList, false);
  };

  return (
    <div className="flex flex-col">
      {/* 1. Заголовок блоку */}
      <span className="mb-2 text-[16px] font-extrabold uppercase leading-6 tracking-[-0.32px] text-main md:mb-4 md:text-[20px] md:leading-6 md:tracking-[-0.4px]">
        Ingredients
      </span>

      {/* 2. Рядок вибору: Селект + Поле кількості */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-5">
        {/* Випадаючий список (червоніє при помилці вибору або порожньому списку) */}
        <div className="w-full md:w-78.75">
          <RecipeSelect
            placeholder="Add the ingredient"
            options={ingredientsOptions}
            value={values.currentIngredientId}
            loading={ingredientsLoading}
            onChange={(option) => {
              setFieldValue("currentIngredientId", option.id, false);
              setFieldError("currentIngredientId", undefined);
              setFieldError("ingredients", undefined);
            }}
            error={isIngredientError || isListError}
          />
        </div>

        {/* Поле введення кількості */}
        <div className="relative w-full md:w-78.5">
          <input
            type="text"
            value={values.currentMeasure}
            onChange={(e) => {
              const val = e.target.value;
              setFieldValue("currentMeasure", val, false);

              if (touched.currentMeasure) {
                if (val.trim().length === 0) {
                  setFieldError("currentMeasure", "Please enter quantity (e.g. 400 g)");
                } else {
                  setFieldError("currentMeasure", undefined);
                }
              }
            }}
            onBlur={() => {
              setFieldTouched("currentMeasure", true, false);
              if (!values.currentMeasure.trim()) {
                setFieldError("currentMeasure", "Please enter quantity (e.g. 400 g)");
              }
            }}
            placeholder="Enter quantity"
            className={`h-12 w-full border-b bg-transparent pb-2.5 text-[14px] font-medium outline-none transition-colors duration-200 placeholder:transition-colors focus:placeholder:text-transparent md:h-14 md:text-[16px] ${
              isMeasureError
                ? "border-[#AE0000] text-[#AE0000] caret-[#AE0000] placeholder:text-[#AE0000]"
                : "border-gray text-main caret-main placeholder:text-gray hover:border-main hover:placeholder:text-main focus:border-main"
            }`}
          />

          {isMeasureError && (
            <span className="mt-1 block text-xs font-medium text-[#AE0000]">
              {errors.currentMeasure}
            </span>
          )}
        </div>
      </div>

      {/* 3. Кнопка "ADD INGREDIENT +" */}
      <div className="mt-8 md:mt-10">
        <button
          type="button"
          onClick={handleAddIngredient}
          className="flex h-12 w-46.5 items-center justify-between rounded-modal border border-main bg-transparent px-5 text-[14px] font-bold uppercase tracking-[-0.28px] text-main transition-all hover:bg-main hover:text-white focus:bg-main focus:text-white md:h-14 md:w-57.25 md:px-8 md:text-[16px] md:tracking-[-0.32px]"
        >
          <span>Add ingredient</span>
          <Icon name="plus" className="h-5 w-5 md:h-5.5 md:w-5.5" />
        </button>
      </div>

      {/* Помилка валідації списку при сабміті */}
      {isListError && (
        <span className="mt-2 block text-xs font-medium text-[#AE0000]">
          {errors.ingredients as string}
        </span>
      )}

      {/* 4. Картки доданих інгредієнтів — вигляд як на RecipeDetails (Tailwind) */}
      {values.ingredients.length > 0 && (
        <ul className="mt-8 grid grid-cols-2 gap-[16px] md:mt-10 md:grid-cols-3 md:gap-[20px]">
          {values.ingredients.map((item) => (
            <li
              key={item.id}
              className="relative flex items-center gap-[10px] rounded-[16px] bg-white pr-6 md:gap-[14px]"
            >
              <IngredientThumb src={item.img} name={item.name} />

              <div className="flex min-w-0 flex-col gap-[6px]">
                <span className="truncate text-[14px] font-medium leading-5 text-main md:text-[16px] md:leading-6">
                  {item.name}
                </span>
                <span className="truncate text-[14px] font-medium leading-5 text-gray md:text-[16px] md:leading-6">
                  {item.measure}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleRemoveIngredient(item.id)}
                aria-label={`Remove ${item.name}`}
                className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center text-main transition-opacity hover:opacity-60"
              >
                <Icon name="close" className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
