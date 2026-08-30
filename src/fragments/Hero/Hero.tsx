import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../store/hooks.ts";
import { openModal } from "../../features/ui/modalSlice.ts";

export const Hero = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleAddRecipe = () => {
    if (isAuthenticated) navigate("/recipe/add");
    else dispatch(openModal("signin"));
  };

  return (
    <section
      aria-label="Hero"
      className="-mt-px px-2 pb-2 md:px-4 md:pb-4 lg:px-5 lg:pb-5"
    >
      <div className="relative mx-auto max-w-[375px] overflow-hidden rounded-b-[20px] bg-main px-4 pb-16 pt-12 text-center text-white md:max-w-[768px] md:rounded-b-[30px] md:px-8 md:pb-24 md:pt-16 min-[1440px]:max-w-[1440px]! min-[1440px]:px-[60px]! min-[1440px]:pb-28! min-[1440px]:pt-20!">
        <h1 className="relative mx-auto max-w-[330px] text-[40px] font-extrabold uppercase leading-[1] tracking-[-0.02em] md:max-w-[680px] md:text-[70px] min-[1440px]:max-w-[880px]! min-[1440px]:text-[90px]!">
          Improve Your Culinary Talents
        </h1>

        <p className="relative mx-auto mt-6 max-w-[330px] text-[14px] leading-[1.4] tracking-[-0.02em] md:mt-8 md:max-w-[580px] md:text-[16px]">
          Amazing recipes for beginners in the world of cooking, enveloping you in the
          aromas and tastes of various cuisines.
        </p>

        <button
          type="button"
          onClick={handleAddRecipe}
          className="relative mt-8 rounded-full border border-white px-6 py-3 text-[14px] font-bold uppercase tracking-[-0.02em] transition-colors hover:bg-white hover:text-main md:mt-10 md:px-8 md:py-4 md:text-[16px] cursor-pointer"
        >
          Add recipe
        </button>

        <div className="relative mx-auto mt-14 h-[172px] w-[280px] md:mt-20 md:h-[273px] md:w-[452px]">
          <div className="absolute left-[90px] top-0 h-[172px] w-[190px] -rotate-12 overflow-hidden rounded-[30px] shadow-2xl md:left-[150px] md:h-[273px] md:w-[302px] md:rounded-[30px]">
            <img
              src="/images/hero/dish-main.jpg"
              alt="Beef Wellington sliced open on a wooden serving board"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute left-0 top-[92px] h-[70px] w-[77px] rotate-[11deg] overflow-hidden rounded-[15px] shadow-2xl md:top-[139px] md:h-[116px] md:w-[128px]">
            <img
              src="/images/hero/dish-small.jpg"
              alt="Plated dessert"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
