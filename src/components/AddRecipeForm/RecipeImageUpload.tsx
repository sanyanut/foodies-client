import React, { useRef, useState, useEffect } from "react";
import { useFormikContext } from "formik";
import { Icon } from "../../shared/Icon/Icon";
import type { RecipeFormValues } from "./recipeValidationSchema";
export const RecipeImageUpload = () => {
  const { values, setFieldValue, setFieldTouched, errors, touched } =
    useFormikContext<RecipeFormValues>();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (values.thumb) {
      const objectUrl = URL.createObjectURL(values.thumb);
      setPreviewUrl(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else {
      setPreviewUrl(null);
    }
  }, [values.thumb]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate with the new file (clears the "required" error); mark touched
      // WITHOUT re-validating — a second validation would run against the stale
      // (still-empty) values and immediately re-add the error.
      setFieldValue("thumb", file, true);
      setFieldTouched("thumb", true, false);
    }
  };

  const handleOpenFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleBlur = () => {
    setFieldTouched("thumb", true, true);
  };

  const isError = Boolean(touched.thumb && errors.thumb);

  return (
    <div className="flex w-full flex-col items-center min-[1440px]:w-137.75 min-[1440px]:shrink-0">
      {/* Прихований системний інпут */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {!previewUrl ? (
        /* Стан 1: Порожній блок (Dropzone) */
        <button
          type="button"
          tabIndex={0}
          onClick={handleOpenFileDialog}
          onBlur={handleBlur}
          className={`group flex h-79.5 w-full cursor-pointer flex-col items-center justify-center rounded-modal border border-dashed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-main focus:ring-offset-2 md:h-100 min-[1440px]:h-100 min-[1440px]:w-137.75 ${
            isError
              ? "border-[#AE0000] bg-[#FFF5F5]"
              : "border-gray hover:border-main bg-[#FAFAFA]"
          }`}
        >
          {/* Іконка зі спрайту */}
          <Icon
            name="camera"
            className={`h-12.5 w-12.5 transition-colors duration-200 md:h-16 md:w-16 ${
              isError ? "text-[#AE0000]" : "text-gray group-hover:text-main"
            }`}
          />

          <span
            className={`mt-4 text-[14px] font-medium leading-5 tracking-[-0.28px] underline underline-offset-4 md:text-[16px] md:leading-6 md:tracking-[-0.32px] ${
              isError ? "text-[#AE0000]" : "text-main"
            }`}
          >
            Upload a photo
          </span>
        </button>
      ) : (
        /* Стан 2: Фото завантажено */
        <div className="flex w-full flex-col items-center">
          <div className="h-79.5 w-full overflow-hidden rounded-modal md:h-100 min-[1440px]:h-100 min-[1440px]:w-137.75">
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
            className="mt-4 self-center rounded text-[14px] font-medium leading-5 tracking-[-0.28px] text-main underline underline-offset-4 transition-opacity hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-main focus:ring-offset-2 md:mt-5 md:text-[16px] md:leading-6 md:tracking-[-0.32px]"
          >
            Upload another photo
          </button>
        </div>
      )}

      {/* Повідомлення про помилку */}
      {isError && (
        <span className="mt-2 text-center text-xs font-medium text-[#AE0000]">
          {errors.thumb as string}
        </span>
      )}
    </div>
  );
};
