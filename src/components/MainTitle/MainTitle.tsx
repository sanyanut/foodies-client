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
    variant === "category" ? "text-[#BFBEBE] md:text-[#1A1A1A]" : "text-[#1A1A1A]";

  return (
    <div
      className={`flex flex-col gap-[16px] md:gap-[20px] mb-[32px] md:mb-[40px] ${className}`}
    >
      <Tag className="font-extrabold uppercase text-[#050505] text-[28px] leading-[32px] tracking-[-0.56px] md:text-[40px] md:leading-[44px] md:tracking-[-0.8px]">
        {title}
      </Tag>
      <p
        className={`font-medium max-w-[343px] md:max-w-[443px] text-[14px] leading-[20px] tracking-[-0.28px] md:text-[16px] md:leading-[24px] md:tracking-[-0.32px] ${descriptionColor}`}
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
