import { NavLink } from "react-router-dom";

import { useAppDispatch } from "../../store/hooks.ts";
import { openModal } from "../../features/ui/modalSlice.ts";

/**
 * Main navigation. `Home` is always shown. `Add recipe` shows on the horizontal
 * (desktop/tablet) nav and in the mobile drawer for authed users; for guests it
 * opens the Sign In modal instead of navigating. Active route gets an outlined
 * pill (Figma). Colour is inherited.
 */
interface NavProps {
  authed: boolean;
  variant?: "horizontal" | "vertical";
  onNavigate?: () => void;
}

export const Nav = ({ authed, variant = "horizontal", onNavigate }: NavProps) => {
  const dispatch = useAppDispatch();

  const itemClass = (isActive: boolean) =>
    `inline-flex items-center rounded-full border px-4 py-3 font-bold uppercase tracking-[-0.02em] transition-colors ${
      isActive ? "border-gray" : "border-transparent hover:opacity-70"
    } ${variant === "vertical" ? "text-[14px]" : "text-[12px]"}`;

  // "Add recipe" shows on the desktop/tablet nav (guests included), and in the
  // mobile burger drawer for authenticated users.
  const showAddRecipe = variant === "horizontal" || authed;

  const handleGuestAddRecipe = () => {
    dispatch(openModal("signin"));
    onNavigate?.();
  };

  return (
    <nav aria-label="Main navigation">
      <ul
        className={
          variant === "vertical"
            ? "flex flex-col gap-6"
            : "flex items-center gap-1 lg:gap-3"
        }
      >
        <li>
          <NavLink
            to="/"
            end
            onClick={onNavigate}
            className={({ isActive }) => itemClass(isActive)}
          >
            Home
          </NavLink>
        </li>

        {showAddRecipe && (
          <li>
            {authed ? (
              <NavLink
                to="/recipe/add"
                onClick={onNavigate}
                className={({ isActive }) => itemClass(isActive)}
              >
                Add recipe
              </NavLink>
            ) : (
              <button
                type="button"
                onClick={handleGuestAddRecipe}
                className={itemClass(false)}
              >
                Add recipe
              </button>
            )}
          </li>
        )}
      </ul>
    </nav>
  );
};
