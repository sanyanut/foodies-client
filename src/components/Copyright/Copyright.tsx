export const Copyright = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="text-center text-sm text-[#BFBEBE]">
      @{currentYear}, Foodies. All rights reserved
    </div>
  );
};
