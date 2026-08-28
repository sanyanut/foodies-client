import { Breadcrumbs } from "../../components/Breadcrumbs/Breadcrumbs";
import { MainTitle } from "../../components/MainTitle/MainTitle";
import { AddRecipeForm } from "../../components/AddRecipeForm/AddRecipeForm";

export const AddRecipePage = () => {
  return (
    <div className="mx-auto w-full max-w-360 flex-1 px-4 pt-16 pb-8 md:px-8 md:pb-20 min-[1440px]:px-20 min-[1440px]:pt-20 min-[1440px]:pb-30">
      <Breadcrumbs currentPage="Add recipe" />
      <MainTitle
        title="Add recipe"
        description="Reveal your culinary art, share your favorite recipe and create gastronomic masterpieces with us."
      />
      <AddRecipeForm />
    </div>
  );
};
