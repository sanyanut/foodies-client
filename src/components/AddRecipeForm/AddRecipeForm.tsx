/**
 * Головний контейнер форми створення нового рецепта.
 *
 * Призначення:
 * - Ініціалізує контекст керування формою через `react-hook-form` (`FormProvider`).
 * - Визначає структуру та типи даних форми (`RecipeFormData`).
 * - Організовує адаптивний лейаут: на мобільних і планшетах елементи розміщуються вертикально в одну колонку, на десктопі — у дві колонки (фото ліворуч, поля праворуч).
 * - Збирає всі валідовані дані для відправки на сервер у функції `onSubmit`.
 */
import { useForm, FormProvider } from "react-hook-form";
import { RecipeTitleFields } from "./RecipeTitleFields";
import { RecipeImageUpload } from "./RecipeImageUpload";

export interface RecipeFormData {
  title: string;
  description: string;
  category: string;
  area: string;
  time: string;
  instructions: string;
  thumb?: File | null;
}

export const AddRecipeForm = () => {
  const methods = useForm<RecipeFormData>({
    mode: "onTouched",
    defaultValues: {
      title: "",
      description: "",
      category: "",
      area: "",
      time: "10",
      instructions: "",
      thumb: null,
    },
  });

  const onSubmit = (data: RecipeFormData) => {
    console.log("Form Submitted:", data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="w-full">
        {/* Контейнер: на десктопі фото зліва (551px), поля справа (max 540px), gap 80px */}
        <div className="flex flex-col gap-[32px] md:gap-[40px] lg:flex-row lg:items-start lg:justify-between lg:gap-[80px]">
          {/* Ліва колонка: Фото */}
          <RecipeImageUpload />

          {/* Права колонка: Поля форми */}
          <div className="flex w-full flex-1 flex-col gap-6 lg:max-w-[540px]">
            <RecipeTitleFields />
            {/* Тут будуть Dropdowns (Category, Area) та Cooking Time */}
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
