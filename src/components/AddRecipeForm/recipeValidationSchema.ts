import * as Yup from "yup";

/**
 * Тип для окремого доданого інгредієнта у списку форми
 */
export interface AddedIngredient {
  id: string;
  name: string;
  measure: string;
  img?: string;
}

/**
 * Головний TypeScript-інтерфейс значень форми створення рецепта
 */
export interface RecipeFormValues {
  thumb: File | null;
  title: string;
  description: string;
  category: string;
  area: string;
  time: number;
  currentIngredientId: string;
  currentMeasure: string;
  ingredients: AddedIngredient[];
  instructions: string;
}

/**
 * Початкові значення форми (Initial Values)
 */
export const initialRecipeValues: RecipeFormValues = {
  thumb: null,
  title: "",
  description: "",
  category: "",
  area: "",
  time: 1,
  currentIngredientId: "",
  currentMeasure: "",
  ingredients: [],
  instructions: "",
};

/**
 * Yup-схема валідації з інформативними повідомленнями
 */
export const recipeValidationSchema = Yup.object().shape({
  thumb: Yup.mixed<File>()
    .nullable()
    .required("Please upload a photo of your recipe")
    .test("fileRequired", "Please upload a photo of your recipe", (value) =>
      Boolean(value),
    ),

  title: Yup.string().trim().required("Please enter a recipe title"),

  description: Yup.string()
    .trim()
    .max(200, "Description must be 200 characters or less")
    .required("Please provide a brief description of the recipe"),

  category: Yup.string().required("Please select a recipe category"),

  area: Yup.string().required("Please select an area/cuisine"),

  time: Yup.number()
    .min(1, "Cooking time must be at least 1 minute")
    .required("Please specify cooking time"),

  ingredients: Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.string().required(),
        name: Yup.string().required(),
        measure: Yup.string().trim().required("Measure is required"),
        img: Yup.string().optional(),
      }),
    )
    .min(1, "Please add at least one ingredient"),

  instructions: Yup.string()
    .trim()
    .max(1000, "Preparation instructions must be 1000 characters or less")
    .required("Please provide recipe preparation instructions"),
});
