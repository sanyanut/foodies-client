import type { ReactNode } from "react";

interface IProfileContainerProps {
  readonly sidebar: ReactNode;
  readonly content: ReactNode;
}

export function UserPageContainer({ sidebar, content }: IProfileContainerProps) {
  return (
    <div className="max-w-[1440px]  py-8">
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
        <div className="w-full md:w-1/3 lg:w-[400px] flex-shrink-0">{sidebar}</div>
        <div className="w-full flex-grow">{content}</div>
      </div>
    </div>
  );
}
