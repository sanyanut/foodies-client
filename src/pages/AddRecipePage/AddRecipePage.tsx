import { Link } from "react-router-dom";
import { Copyright } from "../../components/Copyright/Copyright";

export const AddRecipePage = () => {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#FFFFFF]">
      <header>Header placeholder</header>
      <main className="mx-auto w-full max-w-[1440px] flex-1 px-[16px] py-10 md:px-[32px] lg:px-[80px]">
        <nav className="mb-[32px] flex items-center gap-2 text-[14px] font-extrabold uppercase tracking-wider md:mb-[64px]">
          <Link to="/" className="text-[#BFBEBE] transition-colors hover:text-[#1A1A1A]">
            Home
          </Link>
          <span className="text-[#BFBEBE]"></span>
          <span className="text-[1A1A1A]">Add recipe</span>
        </nav>

        <div className="mb-[60px] md:mb-[80px]">
          <h1 className="mb-4 text-[28px] font-extrabold uppercase leading-[32px] text-[#050505] md:text-[40px] md:leading-[44px]">
            Add recipe
          </h1>
          <p className="max-w-[500px] text-[14px] leading-[20px] text-[#050505] md:text-[16px] md:leading-[24px]">
            Reveal your culinary art, share your favorite recipe and create gastronomic
            masterpieces with us.
          </p>
        </div>
        <div className="flex min-h-[400px] w-full items-center justify-center rounded-[30px] border-2 border-dashed border-[#BFBEBE] text-[#BFBEBE]">
          AddRecipeForm
        </div>
      </main>
      <footer className="flex w-full flex-col items-center justify-center gap-4 border-t border-[#BFBEBE]/30 py-6">
        Footed Placeholder
        <Copyright />
      </footer>
    </div>
  );
};
