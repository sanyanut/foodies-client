import { useAppDispatch, useAppSelector } from "../../store/hooks.ts";
import { openModal } from "../../features/ui/modalSlice.ts";

/**
 * Guest actions rendered as a segmented slider (Figma): a white pill with an
 * inner dark-grey "thumb" that slides under the active segment. The active
 * segment is derived from the open auth modal, so switching Sign in ↔ Sign up —
 * from the header OR from inside a modal ("Create an account" / "Sign in") —
 * slides the thumb. It rests on Sign up when no auth modal is open.
 */
type AuthMode = "signin" | "signup";

interface AuthBarProps {
  /** Called after opening a modal (e.g. to close the mobile menu). */
  onAction?: () => void;
  className?: string;
  /** Dark header (HomePage) vs light header — a border keeps the white pill
   *  visible on a white header. */
  onDark?: boolean;
}

export const AuthBar = ({ onAction, className = "", onDark = true }: AuthBarProps) => {
  const dispatch = useAppDispatch();
  const activeModal = useAppSelector((state) => state.modal.activeModal);
  const active: AuthMode = activeModal === "signin" ? "signin" : "signup";

  const select = (modal: AuthMode) => {
    dispatch(openModal(modal));
    onAction?.();
  };

  const segment = (modal: AuthMode, label: string) => (
    <button
      type="button"
      onClick={() => select(modal)}
      className={`relative z-10 rounded-full px-6 py-2 text-[14px] font-medium uppercase tracking-[-0.02em] transition duration-300 active:scale-95 cursor-pointer ${
        active === modal ? "text-white" : "text-main"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div
      className={`relative grid grid-cols-2 rounded-full bg-white p-1 ${
        onDark ? "" : "border border-gray/40"
      } ${className}`}
    >
      {/* Sliding thumb: sits at the left segment, shifts right for "signup". */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-dark transition-transform duration-300 ease-out cursor-pointer ${
          active === "signup" ? "translate-x-full" : "translate-x-0"
        }`}
      />
      {segment("signin", "Sign in")}
      {segment("signup", "Sign up")}
    </div>
  );
};
