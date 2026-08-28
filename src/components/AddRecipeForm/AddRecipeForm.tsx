import React, { useEffect } from "react";
import { Formik, Form } from "formik";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchLookups } from "../../features/recipes/lookupsSlice";
import { createRecipe } from "../../features/recipes/recipesApi";
import { Icon } from "../../shared/Icon/Icon";

import { RecipeImageUpload } from "./RecipeImageUpload";
import { RecipeTitleFields } from "./RecipeTitleFields";
import { RecipeSelect } from "./RecipeSelect";
import { CookingTime } from "./CookingTime";
import { RecipeIngredients } from "./RecipeIngredients";
import { FormTextarea } from "./FormTextarea";
import {
  initialRecipeValues,
  recipeValidationSchema,
  type RecipeFormValues,
} from "./recipeValidationSchema";

export const AddRecipeForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { categories, areas } = useAppSelector((state) => state.lookups);

  useEffect(() => {
    dispatch(fetchLookups());
  }, [dispatch]);

  const handleSubmit = async (
    values: RecipeFormValues,
    {
      setSubmitting,
      resetForm,
    }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void },
  ) => {
    try {
      const formData = new FormData();

      if (values.thumb) {
        formData.append("thumb", values.thumb);
      }
      formData.append("title", values.title.trim());
      formData.append("description", values.description.trim());
      formData.append("categoryId", values.category);
      formData.append("areaId", values.area);
      formData.append("time", String(values.time));
      formData.append("instructions", values.instructions.trim());

      formData.append(
        "ingredients",
        JSON.stringify(
          values.ingredients.map((item) => ({
            ingredientId: item.id,
            measure: item.measure.trim(),
          })),
        ),
      );

      const created = await createRecipe(formData);

      toast.success("Recipe successfully created!");
      resetForm();
      navigate(`/recipe/${created.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create recipe");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialRecipeValues}
      validationSchema={recipeValidationSchema}
      onSubmit={handleSubmit}
    >
      {({
        values,
        errors,
        touched,
        setFieldValue,
        setFieldTouched,
        resetForm,
        isSubmitting,
      }) => (
        <Form className="mt-8 w-full md:mt-10">
          {/* Головний контейнер: 
              - Mobile (<768px): flex-col, gap 32px (gap-8)
              - Tablet (768px - 1439px): flex-col, gap 80px (md:gap-20)
              - Desktop (1440px+): flex-row, gap 80px (min-[1440px]:flex-row min-[1440px]:gap-20)
          */}
          <div className="flex flex-col gap-8 md:gap-20 min-[1440px]:flex-row min-[1440px]:items-start min-[1440px]:justify-between">
            {/* 1. Блок фото (зліва на Desktop) */}
            <div className="shrink-0">
              <RecipeImageUpload />
            </div>

            {/* 2. Права колонка форми (на Desktop займає 649px) */}
            <div className="flex w-full flex-1 flex-col min-[1440px]:max-w-162.25">
              {/* Поля вводу (gap 20px Mobile / 60px Tablet & Desktop) */}
              <div className="flex flex-col gap-5 md:gap-15">
                {/* Title + Description */}
                <RecipeTitleFields />

                {/* Category + Cooking time */}
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:gap-5">
                  <div className="w-full md:w-78.75">
                    <RecipeSelect
                      label="Category"
                      placeholder="Select a category"
                      options={categories}
                      value={values.category}
                      onChange={(option) => {
                        setFieldValue("category", option.id);
                        setFieldTouched("category", true, false);
                      }}
                      error={touched.category && errors.category}
                    />
                  </div>

                  <div className="w-full md:w-48.5">
                    <CookingTime />
                  </div>
                </div>

                {/* Area */}
                <div className="w-full md:w-82.5">
                  <RecipeSelect
                    label="Area"
                    placeholder="Area"
                    options={areas}
                    value={values.area}
                    onChange={(option) => {
                      setFieldValue("area", option.id);
                      setFieldTouched("area", true, false);
                    }}
                    error={touched.area && errors.area}
                  />
                </div>

                {/* Ingredients */}
                <RecipeIngredients />
              </div>

              {/* Секція Recipe Preparation */}
              <div className="mt-8 flex flex-col md:mt-20">
                <span className="mb-14 text-[16px] font-extrabold uppercase leading-6 tracking-[-0.32px] text-main md:mb-16 md:text-[20px] md:leading-6 md:tracking-[-0.4px]">
                  Recipe Preparation
                </span>

                <FormTextarea
                  name="instructions"
                  placeholder="Enter recipe"
                  maxLength={1000}
                />
              </div>

              {/* Панель кнопок: Delete + Publish */}
              <div className="mt-8 flex items-center gap-2 md:mt-20">
                <button
                  type="button"
                  onClick={() => resetForm()}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-gray text-main transition-colors hover:border-main md:h-14 md:w-14"
                  aria-label="Reset recipe form"
                >
                  <Icon name="trash" className="h-5 w-5 md:h-6 md:w-6" />
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex h-12 w-31 items-center justify-center rounded-modal border border-main bg-main text-[14px] font-bold uppercase tracking-[-0.28px] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 md:h-14 md:w-36.5 md:text-[16px] md:tracking-[-0.32px]"
                >
                  {isSubmitting ? "Publishing..." : "Publish"}
                </button>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};
