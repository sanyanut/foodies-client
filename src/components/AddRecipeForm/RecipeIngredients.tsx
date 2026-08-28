import React from "react";
import { useFormikContext } from "formik";
import { useAppSelector } from "../../store/hooks";
import { RecipeSelect } from "./RecipeSelect";
import { Icon } from "../../shared/Icon/Icon";
import type { RecipeFormValues, AddedIngredient } from "./recipeValidationSchema";

export const RecipeIngredients: React.FC = () => {
  const { values, setFieldValue, setFieldError, setFieldTouched, errors, touched } =
    useFormikContext<RecipeFormValues>();

  const ingredientsOptions = useAppSelector((state) => state.lookups.ingredients);

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

      {/* 4. Картки доданих інгредієнтів */}
      {values.ingredients.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-4 md:mt-10 md:gap-7">
          {values.ingredients.map((item) => (
            <div
              key={item.id}
              className="relative flex h-18.75 min-w-38.75 items-center rounded-dropdown border border-gray/60 bg-white pr-6.5 md:h-22.5 md:min-w-44.5 md:pr-7.5"
            >
              <div className="flex h-18.75 w-18.75 shrink-0 items-center justify-center p-2.5 md:h-22.5 md:w-22.5 md:p-3.75">
                <div className="flex h-13.75 w-13.75 items-center justify-center overflow-hidden rounded-dropdown bg-[#F7F7F7] md:h-15 md:w-15">
                  {item.img ? (
                    <img
                      src={item.img}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-[22px] md:text-[26px]">🥗</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col pl-0 md:pl-0">
                <span className="truncate text-[14px] font-medium leading-5 tracking-[-0.28px] text-main md:text-[16px] md:leading-6 md:tracking-[-0.32px]">
                  {item.name}
                </span>
                <span className="mt-0.5 truncate text-[14px] font-medium leading-5 tracking-[-0.28px] text-gray md:mt-1 md:text-[16px] md:leading-6 md:tracking-[-0.32px]">
                  {item.measure}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleRemoveIngredient(item.id)}
                className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center text-main transition-opacity hover:opacity-60 md:right-2.5 md:top-2.5"
                aria-label={`Remove ${item.name}`}
              >
                <Icon name="close" className="h-3 w-3 md:h-3.5 md:w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
