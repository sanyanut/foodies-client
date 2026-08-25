import { useField } from "formik";

/** Pill text input for the auth forms (Formik-bound). Shows the field error
 *  below when touched. Matches the Figma input: rounded, gray border, gray
 *  placeholder, `*` in the label text passed as placeholder. */
interface TextFieldProps {
  name: string;
  placeholder: string;
  type?: string;
  autoComplete?: string;
}

export const TextField = ({
  name,
  placeholder,
  type = "text",
  autoComplete,
}: TextFieldProps) => {
  const [field, meta] = useField(name);
  const invalid = Boolean(meta.touched && meta.error);

  return (
    <div className="flex flex-col gap-1">
      <input
        {...field}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={invalid}
        className={`w-full rounded-[30px] border bg-transparent px-[18px] py-[14px] text-[16px] text-main outline-none transition-colors placeholder:text-gray ${
          invalid ? "border-red-500" : "border-gray focus:border-main"
        }`}
      />
      {invalid && <p className="pl-4 text-[12px] text-red-500">{meta.error}</p>}
    </div>
  );
};
