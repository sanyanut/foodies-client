import { Copyright } from "../../components/Copyright/Copyright";
import { Breadcrumbs } from "../../components/Breadcrumbs/Breadcrumbs";
import { AddRecipeForm } from "../../components/AddRecipeForm/AddRecipeForm";
import { MainTitle } from "../../components/MainTitle/MainTitle";

export const AddRecipePage = () => {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#FFFFFF]">
      {/* Заглушка Хедера */}
      <header className="flex h-16 w-full items-center justify-center border-b border-[#BFBEBE]/30 text-sm font-bold text-[#BFBEBE]">
        Header placeholder
      </header>
      <main className="mx-auto w-full max-w-[1440px] flex-1 px-[16px] pt-[64px] md:px-[32px] lg:px-[80px] lg:pt-[80px]">
        <Breadcrumbs currentPage="Add recipe" />
        <MainTitle
          title="Add recipe"
          description="Reveal your culinary art, share your favorite recipe and create gastronomic masterpieces with us."
        />
        <AddRecipeForm />
      </main>
      {/* Заглушка Футера */}
      <footer className="w-full mt-10">
        <div className="flex w-full items-center justify-center pb-10 text-sm font-bold text-[#BFBEBE]">
          Footer Placeholder
        </div>
        <Copyright />
      </footer>
    </div>
  );
};

/**
 * Сторінка створення рецепта (Add Recipe Page).
 *
 * Призначення:
 * - Збирає всі складові частини сторінки в єдину структуру: хедер, хлібні крихти, заголовок з описом, форму додавання рецепта та футер.
 * - Задає глобальні безпечні відступи сторінки (padding) та максимальну ширину контентного контейнера (`max-w-[1440px]`).
 */
