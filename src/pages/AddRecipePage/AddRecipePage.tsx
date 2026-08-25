import { Breadcrumbs } from "../../components/Breadcrumbs/Breadcrumbs";
import { MainTitle } from "../../components/MainTitle/MainTitle";
import { AddRecipeForm } from "../../components/AddRecipeForm/AddRecipeForm";

/**
 * Сторінка створення рецепта (Add Recipe Page).
 *
 * Рендериться всередині SharedLayout (Header + Footer надаються шаблоном), тож
 * тут — лише контент сторінки: хлібні крихти, заголовок з описом і форма.
 */
export const AddRecipePage = () => {
  return (
    <div className="mx-auto w-full max-w-[1440px] flex-1 px-[16px] pt-[64px] pb-16 md:px-[32px] lg:px-[80px] lg:pt-[80px]">
      <Breadcrumbs currentPage="Add recipe" />
      <MainTitle
        title="Add recipe"
        description="Reveal your culinary art, share your favorite recipe and create gastronomic masterpieces with us."
      />
      <AddRecipeForm />
    </div>
  );
};
