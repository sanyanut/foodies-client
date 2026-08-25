/**
 * Компонент завантаження та попереднього перегляду фотографії рецепта.
 *
 * Призначення:
 * - Надає інтерактивну зону для вибору файлу зображення (через прихований `<input type="file" />`).
 * - Створює локальне прев'ю обраного фото (`URL.createObjectURL`).
 * - Дозволяє замінити завантажене зображення кнопкою "Upload another photo".
 * - Повністю інтегрований із `react-hook-form`: реєструє поле `thumb`, валідує обов'язковість фото та підтримує навігацію клавіатурою (Tab / Focus).
 */

import React, { useRef, useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import type { RecipeFormData } from "./AddRecipeForm";

export const RecipeImageUpload = () => {
  const {
    register,
    setValue,
    clearErrors,
    trigger,
    formState: { errors },
  } = useFormContext<RecipeFormData>();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    register("thumb", { required: "Recipe image is required" });
  }, [register]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("thumb", file, { shouldValidate: true, shouldDirty: true });
      clearErrors("thumb");

      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleOpenFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleBlur = () => {
    trigger("thumb");
  };

  return (
    <div className="flex w-full flex-col items-center lg:w-[551px] lg:shrink-0">
      {/* Прихований системний інпут */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {!previewUrl ? (
        /* Стан 1: Порожній блок */
        <button
          type="button"
          tabIndex={0}
          onClick={handleOpenFileDialog}
          onBlur={handleBlur}
          className="group flex h-[318px] w-full cursor-pointer flex-col items-center justify-center rounded-[30px] border border-dashed border-gray transition-all duration-200 hover:border-main focus:outline-none focus:ring-2 focus:ring-main focus:ring-offset-2 md:h-[400px] lg:h-[400px] lg:w-[551px]"
        >
          <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full border border-main transition-transform duration-200 group-hover:scale-105 md:h-[64px] md:w-[64px]">
            <svg
              className="h-[18.75px] w-[18.75px] text-main md:h-[24px] md:w-[24px]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>

          <span className="mt-[8px] font-medium text-main underline underline-offset-4 text-[14px] leading-[20px] tracking-[-0.28px] md:mt-[16px] md:text-[16px] md:leading-[24px] md:tracking-[-0.32px]">
            Upload a photo
          </span>
        </button>
      ) : (
        /* Стан 2: Фото завантажено */
        <div className="flex w-full flex-col items-center">
          <div className="h-[318px] w-full overflow-hidden rounded-[30px] md:h-[400px] lg:h-[400px] lg:w-[551px]">
            <img
              src={previewUrl}
              alt="Recipe preview"
              className="h-full w-full object-cover"
            />
          </div>

          <button
            type="button"
            tabIndex={0}
            onClick={handleOpenFileDialog}
            onBlur={handleBlur}
            className="mt-[16px] self-center rounded font-medium text-main underline underline-offset-4 text-[14px] leading-[20px] tracking-[-0.28px] transition-opacity hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-main focus:ring-offset-2 md:mt-[20px] md:text-[16px] md:leading-[24px] md:tracking-[-0.32px]"
          >
            Upload another photo
          </button>
        </div>
      )}

      {/* Повідомлення про помилку під блоком фото */}
      {errors.thumb && (
        <span className="mt-2 text-center text-xs text-red-500">
          {errors.thumb.message || "Recipe image is required"}
        </span>
      )}
    </div>
  );
};
