import { Link } from "react-router-dom";

/** Clickable app wordmark → HomePage. Colour is inherited (pass a text-* class:
 *  white on the header, dark on the footer). `onClick` lets callers close an
 *  open menu on navigation. */
interface LogoProps {
  className?: string;
  onClick?: () => void;
}

export const Logo = ({ className = "", onClick }: LogoProps) => (
  <Link
    to="/"
    aria-label="Foodies — home"
    onClick={onClick}
    className={`text-[24px] font-bold lowercase leading-none tracking-[-0.02em] ${className}`}
  >
    foodies
  </Link>
);
