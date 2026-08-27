import type { ReactNode } from "react";

interface IProfileContainerProps {
  readonly sidebar: ReactNode;
  readonly content: ReactNode;
}

export function UserPageContainer({ sidebar, content }: IProfileContainerProps) {
  return (
    <div className="py-8">
      {/*
        Mobile + Tablet (< 1440px): колонка, картка центрована
        Desktop (≥ 1440px): рядок — картка зліва як сайдбар, вкладки справа
      */}
      <div className="flex flex-col min-[1440px]:flex-row gap-8 min-[1440px]:gap-12 min-[1440px]:items-start">
        {/* Картка: по центру на мобілці/таблеті, фіксована ширина на десктопі */}
        <div className="w-full flex flex-col items-center min-[1440px]:block min-[1440px]:w-[349px] min-[1440px]:flex-shrink-0">
          {sidebar}
        </div>
        {/* Вкладки: займають весь простір */}
        <div className="w-full min-[1440px]:flex-grow">{content}</div>
      </div>
    </div>
  );
}
