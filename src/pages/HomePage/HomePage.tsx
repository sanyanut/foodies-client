import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../store/hooks.ts";
import { openModal } from "../../features/ui/modalSlice.ts";

/**
 * Placeholder HomePage (full page is out of scope for the Header + Modals task).
 * The "Add recipe" CTA exercises the auth flow: guests get the Sign In modal,
 * authed users go to AddRecipePage.
 */
export const HomePage = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleAddRecipe = () => {
    if (isAuthenticated) navigate("/add-recipe");
    else dispatch(openModal("signin"));
  };

  return (
    <section className="mx-auto max-w-[1440px] px-4 py-16 text-center md:px-8 lg:px-20">
      <h1 className="mx-auto max-w-[850px] text-[28px] font-extrabold uppercase leading-tight tracking-[-0.02em] md:text-[50px]">
        Improve your culinary talents
      </h1>
      <p className="mx-auto mt-6 max-w-[540px] text-[16px] text-gray">
        Amazing recipes for beginners in the world of cooking, enveloping you in the
        aromas and tastes of various cuisines.
      </p>
      <button
        type="button"
        onClick={handleAddRecipe}
        className="mt-8 rounded-full bg-main px-8 py-4 text-[16px] font-bold uppercase tracking-[-0.02em] text-white transition-colors hover:bg-dark"
      >
        Add recipe
      </button>
      <p className="mt-16 text-[13px] text-gray">
        HomePage — placeholder (out of scope for Header + Modals).
      </p>
    </section>
  );
};
