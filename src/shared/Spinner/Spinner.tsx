import { Icon } from "../Icon/Icon.tsx";

interface SpinnerProps {
  /** Sizing/color via className — follows currentColor like every other Icon. */
  className?: string;
  /** Screen-reader text; visually hidden. */
  label?: string;
}

/** Shared loading indicator (icon-loader, sprite-based, per ТЗ) — spins via
 *  Tailwind's `animate-spin`. Used everywhere a "Loading…" text used to be. */
export const Spinner = ({ className = "h-5 w-5", label = "Loading" }: SpinnerProps) => (
  <span role="status" className="inline-flex items-center justify-center">
    <Icon name="loader" className={`animate-spin ${className}`} />
    <span className="sr-only">{label}</span>
  </span>
);
