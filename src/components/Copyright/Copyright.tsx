/**
 * Презентаційний компонент блоку авторських прав (Copyright).
 *
 * Призначення:
 * - Відображає текст копірайту у нижній частині футера з фіксованими стилями та кольором.
 */
export const Copyright = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="w-full border-t border-[#BFBEBE]/30">
      <div className="mx-auto w-[262px] pt-[40px] pb-[35px] md:pb-[40px] lg:pb-[46px]">
        <p
          className="flex items-center justify-center text-center font-medium text-[#1A1A1A] 
          h-[20px] leading-[20px] text-[14px] tracking-[-0.28px] 
          md:text-[16px] md:tracking-[-0.32px] 
          lg:h-[24px] lg:leading-[24px]"
        >
          @{currentYear}, Foodies. All rights reserved
        </p>
      </div>
    </div>
  );
};
