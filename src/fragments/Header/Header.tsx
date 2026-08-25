import { useState } from "react";
import { useLocation } from "react-router-dom";

import { useAppSelector } from "../../store/hooks.ts";
import { Logo } from "../Logo/Logo.tsx";
import { Nav } from "../Nav/Nav.tsx";
import { AuthBar } from "../AuthBar/AuthBar.tsx";
import { UserBar } from "../UserBar/UserBar.tsx";
import { MobileMenu } from "../MobileMenu/MobileMenu.tsx";
import { Icon } from "../../shared/Icon/Icon.tsx";

/** App header (ТЗ): Logo + Nav + AuthBar (guest) / UserBar (authed). Rendered as
 *  an inset card (max-width 1400, rounded top corners), gapped from the top and
 *  sides — 20/16/8px. The card's horizontal padding (60/32/16) is set so the
 *  content edge lands at 80/48/24px from the viewport — the content row stays a
 *  fixed distance from the edge (no collapsing below 1440), giving a capped
 *  1280/672/327 row that lines up with the page content below. Dark (black bg,
 *  white text) only on the HomePage; every other route is white. */
export const Header = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { pathname } = useLocation();
  const onDark = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);

  const logoColor = onDark ? "text-white" : "text-main";

  return (
    <header className="px-2 pt-2 md:px-4 md:pt-4 lg:px-5 lg:pt-5">
      <div
        className={`mx-auto max-w-[1400px] rounded-t-[20px] px-4 py-4 md:rounded-t-[30px] md:px-8 lg:px-[60px] ${
          onDark ? "bg-main text-white" : "border border-white bg-white text-main"
        }`}
      >
        {/* Tablet / desktop: logo left · nav centered · actions right */}
        <div className="hidden grid-cols-3 items-center md:grid">
          <div className="justify-self-start">
            <Logo className={logoColor} />
          </div>
          <div className="justify-self-center">
            <Nav authed={isAuthenticated} />
          </div>
          <div className="justify-self-end">
            {isAuthenticated ? <UserBar /> : <AuthBar onDark={onDark} />}
          </div>
        </div>

        {/* Mobile: guests get the auth pill (no burger); authed users get the
            user chip + burger (which opens the nav drawer). */}
        <div className="flex items-center justify-between md:hidden">
          <Logo className={logoColor} />
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <UserBar />
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                className="transition-transform duration-200 hover:scale-110 active:scale-90"
              >
                <Icon name="burger" className="h-7 w-7" />
              </button>
            </div>
          ) : (
            <AuthBar onDark={onDark} />
          )}
        </div>
      </div>

      {menuOpen && (
        <MobileMenu authed={isAuthenticated} onClose={() => setMenuOpen(false)} />
      )}
    </header>
  );
};
