import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { Icon } from "../../shared/Icon/Icon.tsx";
import { Logo } from "../Logo/Logo.tsx";
import { Nav } from "../Nav/Nav.tsx";

/** Full-viewport right-side drawer (mobile/tablet), opened by the burger for
 *  authed users: logo + close at the top, then the nav (Home + Add recipe).
 *  Slides in from the right with a fading backdrop, and animates out before
 *  unmounting. Closes on backdrop click and Escape. The user chip lives in the
 *  header, not here. */
interface MobileMenuProps {
  authed: boolean;
  onClose: () => void;
}

const ANIMATION_MS = 300;

export const MobileMenu = ({ authed, onClose }: MobileMenuProps) => {
  const [visible, setVisible] = useState(false);

  // Play the exit animation, then let the parent unmount us.
  const close = useCallback(() => {
    setVisible(false);
    window.setTimeout(onClose, ANIMATION_MS);
  }, [onClose]);

  // Trigger the enter animation on mount + lock body scroll.
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [close]);

  return createPortal(
    <div className="fixed inset-0 z-50 md:hidden">
      <div
        className={`absolute inset-0 bg-main/50 transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={close}
      />
      <div
        className={`absolute right-0 top-0 flex h-full w-full flex-col bg-main px-6 py-6 text-white transition-transform duration-300 ease-out ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between pt-3">
          <Logo className="text-white" onClick={close} />
          <button
            type="button"
            onClick={close}
            aria-label="Close menu"
            className="text-white transition-transform duration-200 hover:rotate-90"
          >
            <Icon name="close" className="h-7 w-7" />
          </button>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <Nav authed={authed} variant="vertical" onNavigate={close} />
        </div>
        <div className="flex h-52 shrink-0 -translate-y-28 items-center justify-center gap-4">
          <img
          src="images/hero/dish-small.jpg"
          alt=""
          className="h-20 w-20 rotate-6 rounded-xl object-cover"
          />

          <img
          src="images/hero/dish-main.jpg"
          alt=""
          className="h-40 w-48 -rotate-6 rounded-2xl object-cover"
          />
        </div>
      </div>
    </div>,
    document.body,
  );
};
