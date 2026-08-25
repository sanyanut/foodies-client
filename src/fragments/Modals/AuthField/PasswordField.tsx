import { useState } from "react";
import { useField } from "formik";

import { Icon } from "../../../shared/Icon/Icon.tsx";

/** Pill password input with a show/hide eye toggle (ТЗ: crossed eye = hidden).
 *  Formik-bound; shows the field error below when touched. */
interface PasswordFieldProps {
  name: string;
  placeholder?: string;
  autoComplete?: string;
}

export const PasswordField = ({
  name,
  placeholder = "Password",
  autoComplete = "current-password",
}: PasswordFieldProps) => {
  const [field, meta] = useField(name);
  const [visible, setVisible] = useState(false);
  const invalid = Boolean(meta.touched && meta.error);

  return (
    <div className="flex flex-col gap-1">
      <div className="relative">
        <input
          {...field}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={invalid}
          className={`w-full rounded-[30px] border bg-transparent px-[18px] py-[14px] pr-12 text-[16px] text-main outline-none transition-colors placeholder:text-gray ${
            invalid ? "border-red-500" : "border-gray focus:border-main"
          }`}
        />
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-[18px] top-1/2 -translate-y-1/2 text-main"
        >
          <Icon name={visible ? "eye" : "eye-off"} className="h-5 w-5" />
        </button>
      </div>
      {invalid && <p className="pl-4 text-[12px] text-red-500">{meta.error}</p>}
    </div>
  );
};
