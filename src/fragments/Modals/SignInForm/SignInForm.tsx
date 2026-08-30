import { Formik, Form } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";

import { useAppDispatch } from "../../../store/hooks.ts";
import { login } from "../../../features/auth/authSlice.ts";
import { closeModal } from "../../../features/ui/modalSlice.ts";
import { TextField } from "../AuthField/TextField.tsx";
import { PasswordField } from "../AuthField/PasswordField.tsx";
import { Icon } from "../../../shared/Icon/Icon.tsx";

const schema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const initialValues = { email: "", password: "" };

export const SignInForm = () => {
  const dispatch = useAppDispatch();

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await dispatch(login(values)).unwrap();
          dispatch(closeModal());
        } catch (error) {
          toast.error(typeof error === "string" ? error : "Sign in failed");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form className="flex flex-col gap-[18px]" noValidate>
          <TextField
            name="email"
            type="email"
            placeholder="Email*"
            autoComplete="email"
          />
          <PasswordField
            name="password"
            placeholder="Password"
            autoComplete="current-password"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-[10px] flex w-full items-center justify-center gap-2 rounded-full bg-main px-6 py-4 text-[16px] font-bold uppercase tracking-[-0.02em] text-white transition-colors hover:bg-dark disabled:cursor-not-allowed disabled:bg-gray"
          >
            {isSubmitting && <Icon name="loader" className="h-5 w-5 animate-spin" />}
            {isSubmitting ? "Signing in…" : "Sign in"}
          </button>
        </Form>
      )}
    </Formik>
  );
};
