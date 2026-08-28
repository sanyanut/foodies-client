import React, { useEffect, useRef, useCallback } from "react";
import { useFormikContext } from "formik";
import type { RecipeFormValues } from "./recipeValidationSchema";

interface FormTextareaProps {
  name: keyof RecipeFormValues;
  placeholder: string;
  maxLength: number;
  className?: string;
}

export const FormTextarea: React.FC<FormTextareaProps> = ({
  name,
  placeholder,
  maxLength,
  className = "",
}) => {
  const { values, errors, touched, handleChange, handleBlur } =
    useFormikContext<RecipeFormValues>();

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const value = (values[name] as string) || "";
  const isError = Boolean(touched[name] && errors[name]);

  // Функція перерахунку висоти під кількість рядків
  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  useEffect(() => {
    window.addEventListener("resize", adjustHeight);
    return () => window.removeEventListener("resize", adjustHeight);
  }, [adjustHeight]);

  return (
    <div className={`group relative w-full ${className}`}>
      <div className="relative flex items-start justify-between pb-3.5">
        {/* Поле введення */}
        <textarea
          ref={textareaRef}
          name={name}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          maxLength={maxLength}
          rows={1}
          placeholder={placeholder}
          className={`w-full resize-none overflow-hidden bg-transparent pr-18.75 text-[14px] font-medium leading-5 tracking-[-0.28px] outline-none transition-colors duration-200 wrap-break-word placeholder:transition-colors focus:placeholder:text-transparent md:pr-22.5 md:text-[16px] md:leading-6 md:tracking-[-0.32px] ${
            isError
              ? "text-[#AE0000] caret-[#AE0000] placeholder:text-[#AE0000]"
              : "text-main caret-main placeholder:text-gray hover:placeholder:text-main"
          }`}
        />

        {/* Лічильник символів */}
        <span className="pointer-events-none absolute right-0 top-0 text-[12px] font-medium leading-5 tracking-[-0.24px] md:text-[14px] md:leading-6">
          {isError ? (
            <span className="text-[#AE0000]">
              {value.length}/{maxLength}
            </span>
          ) : (
            <>
              <span className={value.length > 0 ? "text-main" : "text-gray"}>
                {value.length}
              </span>
              <span className="text-gray">/{maxLength}</span>
            </>
          )}
        </span>
      </div>

      {/* Нижня лінія: темніє при ховері та фокусі */}
      <div
        className={`h-px w-full transition-colors duration-200 ${
          isError
            ? "bg-[#AE0000]"
            : "bg-gray group-hover:bg-main group-focus-within:bg-main"
        }`}
      />

      {isError && (
        <span className="mt-1 block text-xs font-medium text-[#AE0000]">
          {errors[name] as string}
        </span>
      )}
    </div>
  );
};
