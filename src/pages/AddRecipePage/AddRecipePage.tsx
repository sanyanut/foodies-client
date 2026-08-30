import { Breadcrumbs } from "../../components/Breadcrumbs/Breadcrumbs";
import { MainTitle } from "../../components/MainTitle/MainTitle";
import { AddRecipeForm } from "../../components/AddRecipeForm/AddRecipeForm";
import { Container } from "../../components/Container/Container";

/**
 * Сторінка створення рецепта (Add Recipe Page).
 *
 * Рендериться всередині SharedLayout (Header + Footer надаються шаблоном), тож
 * тут — лише контент сторінки: хлібні крихти, заголовок з описом і форма.
 */
export const AddRecipePage = () => {
  return (
    <Container className="flex-1 pt-16 pb-8 md:pb-20 min-[1440px]:pt-20! min-[1440px]:pb-30!">
      <Breadcrumbs currentPage="Add recipe" />
      <MainTitle
        title="Add recipe"
        description="Reveal your culinary art, share your favorite recipe and create gastronomic masterpieces with us."
      />
      <AddRecipeForm />
    </Container>
  );
};
