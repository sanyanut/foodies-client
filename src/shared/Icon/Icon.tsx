/**
 * Universal icon component. Renders a symbol from the shared SVG sprite
 * (`public/icons/sprite.svg`) via `<use>`, per the ТЗ requirement to serve all
 * svg icons through a sprite. Colour follows `currentColor`; size via className.
 */
interface IconProps {
  name:
    | "close"
    | "chevron-down"
    | "burger"
    | "eye"
    | "eye-off"
    | "arrow-up-right"
    | "facebook"
    | "instagram"
    | "youtube";
  className?: string;
}

export const Icon = ({ name, className = "h-6 w-6" }: IconProps) => (
  <svg className={className} aria-hidden="true" focusable="false">
    <use href={`/icons/sprite.svg#icon-${name}`} />
  </svg>
);
