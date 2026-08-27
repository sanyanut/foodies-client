import type { ComponentProps, ReactNode } from "react";

type ButtonVariant = "solid" | "outline";

interface ILongButtonProps extends ComponentProps<"button"> {
  readonly pending?: boolean;
  readonly children: ReactNode;
  readonly variant?: ButtonVariant;
}
export function LongButton({
  pending,
  children,
  disabled,
  variant = "solid",
  className,
  ...props
}: Readonly<ILongButtonProps>) {
  const baseClasses =
    "w-full rounded-full px-6 py-4 text-[16px] font-bold uppercase tracking-[-0.02em] transition-colors disabled:cursor-not-allowed disabled:opacity-50";

  // Стилі, які залежать від обраного варіанту
  const variantClasses = {
    solid: "bg-main text-white hover:bg-dark border border-transparent",
    outline: "bg-white text-main border border-main hover:bg-gray-50",
  };

  return (
    <button
      type="button"
      disabled={disabled || pending}
      className={`${baseClasses} ${variantClasses[variant]} ${className || ""}`}
      {...props}
    >
      {children}
    </button>
  );
}
