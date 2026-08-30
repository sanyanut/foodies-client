import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../store/hooks.ts";
import { openModal } from "../../features/ui/modalSlice.ts";
import { Icon } from "../../shared/Icon/Icon.tsx";
import { AVATAR_MOT_FOUND_IMG } from "../../shared/constants.ts";

/** Authenticated user chip: avatar + name + chevron on a dark pill, with a dark
 *  dropdown (black + white border) — the same on light and dark headers.
 *  Dropdown: Profile → UserPage, Log out → LogOutModal. Falls back to the name's
 *  initial when the user has no avatar. */
interface UserBarProps {
  onAction?: () => void;
}

export const UserBar = ({ onAction }: UserBarProps) => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  if (!user) return null;
  // const initial = user.name.trim().charAt(0).toUpperCase() || "U";

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full bg-dark py-0 pl-0 pr-4 text-white transition-colors hover:bg-dark cursor-pointer"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <img
          src={user?.avatar || AVATAR_MOT_FOUND_IMG}
          alt=""
          className="h-[50px] w-[50px] rounded-full object-cover"
        />
        <span className="text-[12px] font-semibold uppercase tracking-[-0.02em]">
          {user.name}
        </span>
        <Icon
          name="chevron-down"
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-40 mt-3 flex w-[122px] flex-col gap-[6px] rounded-dropdown border border-white/20 bg-main p-4 text-white shadow-lg md:w-[148px] md:border-white"
        >
          <Link
            to={`/profile`}
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onAction?.();
            }}
            className="text-[12px] font-bold uppercase tracking-[-0.24px] transition-colors hover:text-white/60"
          >
            Profile
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              dispatch(openModal("logout"));
              onAction?.();
            }}
            className="flex items-center gap-[2px] text-left text-[12px] font-bold uppercase tracking-[-0.24px] transition-colors hover:text-white/60 cursor-pointer"
          >
            Log out
            <Icon name="arrow-up-right" className="h-[18px] w-[18px]" />
          </button>
        </div>
      )}
    </div>
  );
};
