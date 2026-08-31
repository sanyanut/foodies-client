import { useEffect } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";

import { Icon } from "../../../shared/Icon/Icon.tsx";

/**
 * Universal modal (ТЗ "Modal"): renders `children` in a portal over a backdrop,
 * with a single close button. Closes on the ✕ button, a backdrop click, and the
 * Escape key. Locks body scroll while open.
 */
interface ModalProps {
  onClose: () => void;
  children: ReactNode;
  /** Tailwind max-width utility for the card (modals differ in width). */
  maxWidthClass?: string;
  ariaLabel?: string;
}

export const Modal = ({
  onClose,
  children,
  maxWidthClass = "max-w-[560px]",
  ariaLabel,
}: ModalProps) => {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-main/50 px-4 py-6 sm:items-center"
      // Close only when the backdrop itself is pressed (not on drag-release from
      // inside the card).
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className={`relative w-full ${maxWidthClass} rounded-modal bg-white px-[30px] py-[60px] sm:px-10 md:px-20 md:py-20`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 text-main transition-colors hover:text-gray md:right-[42px] md:top-[42px] cursor-pointer"
        >
          <Icon name="close" className="h-7 w-7" />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
};
