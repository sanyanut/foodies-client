import type { ComponentPropsWithoutRef, ElementType } from "react";

/**
 * Responsive content wrapper with the project's three fixed breakpoints.
 *
 * Width is "stepped" so content never stretches between breakpoints — it is
 * fluid only from 320–374px, then locks to a fixed, centered width:
 *   • < 375px            → fluid (100%)
 *   • 375–767px (mobile) → capped at 375px, centered
 *   • 768–1439px (tablet)→ capped at 768px, centered
 *   • ≥ 1440px (desktop) → capped at 1440px, centered
 *
 * Side padding follows the same steps (16 / 32 / 80). Pass `className` for
 * section-specific styling (vertical padding, background, etc.) and `as` to
 * change the element (e.g. `as="section"`).
 *
 * The `min-[1440px]:` utilities carry a trailing `!`: Tailwind v4 emits the
 * arbitrary-breakpoint block *before* the standard `md:` block, so at ≥1440px
 * an equal-specificity `md:max-w-[768px]` would otherwise win the cascade and
 * pin the container at 768. `!` forces the desktop step to apply. (Same
 * workaround as CategoryList / Hero.)
 */
/**
 * The stepped-width + responsive-padding classes, exported for sections that
 * can't use the `<Container>` component directly (e.g. a `<section>` that needs
 * its own `ref`). Compose it with section-specific classes.
 */
export const containerClass =
  "mx-auto w-full max-w-[375px] px-[16px] md:max-w-[768px] md:px-[32px] min-[1440px]:max-w-[1440px]! min-[1440px]:px-[80px]!";

type ContainerProps<T extends ElementType> = {
  as?: T;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className">;

export const Container = <T extends ElementType = "div">({
  as,
  className = "",
  ...rest
}: ContainerProps<T>) => {
  const Tag = (as ?? "div") as ElementType;
  return <Tag className={`${containerClass} ${className}`} {...rest} />;
};
