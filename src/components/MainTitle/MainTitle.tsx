/**
 * Універсальний компонент головного заголовка та опису сторінки/секції.
 *
 * Призначення:
 * - Відображає великий заголовок і текст опису з точними адаптивними відступами та типографікою.
 * - Проп `tag`: дозволяє обирати семантичний тег `h1` (для сторінок) або `h2` (для секцій).
 * - Проп `variant`: перемикає стилізацію між звичайними сторінками (`page`) та секціями категорій (`category`), де колір опису на мобільному стає світлішим.
 */
interface MainTitleProps {
  title: string;
  description: string;
  tag?: "h1" | "h2";
  variant?: "page" | "category";
  className?: string;
}

export const MainTitle = ({
  title,
  description,
  tag: Tag = "h1",
  variant = "page",
  className = "",
}: MainTitleProps) => {
  // Для категорій на мобільному текст сірий (#BFBEBE), на десктопі — темний (#1A1A1A)
  const descriptionColor =
    variant === "category" ? "text-gray md:text-dark" : "text-dark";
  const descriptionWidth =
    variant === "category"
      ? "max-w-[343px] md:max-w-[531px]"
      : "max-w-[343px] md:max-w-[443px]";

  return (
    <div className={`flex flex-col gap-4 md:gap-5 mb-8 md:mb-10 ${className}`}>
      <Tag className="font-extrabold uppercase text-main text-[28px] leading-8 tracking-[-0.56px] md:text-[40px] md:leading-11 md:tracking-[-0.8px]">
        {title}
      </Tag>
      <p
        className={`font-medium ${descriptionWidth} text-[14px] leading-5 tracking-[-0.28px] md:text-[16px] md:leading-6 md:tracking-[-0.32px] ${descriptionColor}`}
      >
        {description}
      </p>
    </div>
  );
};

// Для використання у категоріях на головній сторінці
// <MainTitle
//   tag="h2"
//   variant="category"
//   title="Categories"
//   description="Discover a limitless world of culinary possibilities and enjoy exquisite recipes."
// />

// Для використання у профілі
// <MainTitle
//   title="Profile"
//   description="Reveal your culinary art, share your favorite recipe and create gastronomic masterpieces with us."
// />
