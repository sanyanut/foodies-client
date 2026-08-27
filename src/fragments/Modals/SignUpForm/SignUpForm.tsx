import { Formik, Form } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";

import { useAppDispatch } from "../../../store/hooks.ts";
import { register } from "../../../features/auth/authSlice.ts";
import { closeModal } from "../../../features/ui/modalSlice.ts";
import { TextField } from "../AuthField/TextField.tsx";
import { PasswordField } from "../AuthField/PasswordField.tsx";

// Yup rules mirror the backend Zod schema (auth.schemas.ts):
// name 2–64, valid email, password 8–128.
const schema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(64, "Name must be at most 64 characters")
    .required("Name is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters")
    .required("Password is required"),
});

const initialValues = { name: "", email: "", password: "" };

export const SignUpForm = () => {
  const dispatch = useAppDispatch();

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await dispatch(register(values)).unwrap();
          dispatch(closeModal());
        } catch (error) {
          toast.error(typeof error === "string" ? error : "Registration failed");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form className="flex flex-col gap-[18px]" noValidate>
          <TextField name="name" placeholder="Name*" autoComplete="name" />
          <TextField
            name="email"
            type="email"
            placeholder="Email*"
            autoComplete="email"
          />
          <PasswordField
            name="password"
            placeholder="Password"
            autoComplete="new-password"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-[10px] w-full rounded-full bg-main px-6 py-4 text-[16px] font-bold uppercase tracking-[-0.02em] text-white transition-colors hover:bg-dark disabled:cursor-not-allowed disabled:bg-gray"
          >
            {isSubmitting ? "Creating…" : "Create"}
          </button>
        </Form>
      )}
    </Formik>
  );
};
